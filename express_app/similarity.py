from sentence_transformers import SentenceTransformer, util
from nltk.corpus import wordnet
import nltk
from flask import Flask,request,jsonify
from flask_cors import CORS

app=Flask(__name__)

CORS(app,supports_credentials=True)

nltk.download('wordnet')

# Load an even better SBERT model for higher accuracy
model = SentenceTransformer("sentence-transformers/stsb-roberta-large") # Smaller model


class SuffixTreeNode:
    def __init__(self):
        self.children = {}
        self.indexes = []

class SuffixTree:
    def __init__(self, words):
        self.root = SuffixTreeNode()
        self.words = words
        self._build_suffix_tree()

    def _build_suffix_tree(self):
        for i in range(len(self.words)):
            self._insert_suffix(self.words[i:], i)

    def _insert_suffix(self, suffix, index):
        node = self.root
        for word in suffix:
            if word not in node.children:
                node.children[word] = SuffixTreeNode()
            node = node.children[word]
            node.indexes.append(index)

    def search(self, phrase):
        node = self.root
        for word in phrase:
            if word not in node.children:
                return []  
            node = node.children[word]
        return node.indexes  

def get_synonyms(word):
    synonyms = {word}
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            synonyms.add(lemma.name().replace('_', ' '))
    return list(synonyms)  # Return as a list for better handling

def expand_text(text):
    words = text.lower().split()
    expanded_words = []
    for word in words:
        synonyms = get_synonyms(word)
        expanded_words.append(synonyms[:3])  # Take top 3 synonyms
    return [' '.join(words) for words in zip(*expanded_words)]

def suffix_tree_match(text1, text2, phrase_length=3):
    words1 = text1.lower().split()
    words2 = text2.lower().split()
    suffix_tree = SuffixTree(words1)
    ngrams2 = [tuple(words2[i:i+phrase_length]) for i in range(len(words2) - phrase_length + 1)]
    matches = 0
    for ngram in ngrams2:
        if suffix_tree.search(ngram):
            matches += 1
    return matches / max(len(ngrams2), 1)

def hybrid_similarity(text1, text2):
    embedding1 = model.encode(text1, convert_to_tensor=True)
    embedding2 = model.encode(text2, convert_to_tensor=True)
    sbert_similarity = util.pytorch_cos_sim(embedding1, embedding2).item()

    # Expand texts with multiple synonyms before Suffix Tree matching
    expanded_doc1 = expand_text(text1)
    expanded_doc2 = expand_text(text2)
    
    suffix_tree_scores = [suffix_tree_match(doc1, doc2) for doc1 in expanded_doc1 for doc2 in expanded_doc2]
    suffix_tree_score = max(suffix_tree_scores) if suffix_tree_scores else 0

    # Increase SBERT weight for better accuracy
    final_score = 0.95 * sbert_similarity + 0.05 * suffix_tree_score

    return final_score





@app.route("/getscore",methods=['POST','GET'])
def getscore():
    # Example sentences
    data=request.get_json()
    doc1 =data['text1']
    doc2 =data['text2']

    # Compute Optimized Hybrid Similarity
    similarity_score = hybrid_similarity(doc1, doc2)
    print(f"Optimized Hybrid Similarity Score: {similarity_score:.2f}")

    return jsonify({'success':True,'score':round(similarity_score*100)})

import os


port = int(os.environ.get("PORT", 5000))  # Automatically get assigned port
app.run(host="0.0.0.0", port=port, debug=True)

