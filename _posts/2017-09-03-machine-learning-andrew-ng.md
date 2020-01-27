---
layout: post
title: "Machine Learning, Andrew Ng"
description: ""
category: 
tags: []
---
<script type="text/javascript" src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=default"></script>

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# 1 Introduction

## 1.2 Welcome

### Machine Learning

* Grew out of work in AI
* New capabilities for computers

### Examples

* Database mining
    * Large datasets from growth of automation/web.
    * E.g., Web click data, medical records, biology, engineering
* Application cannot program by hand.
    * E.g., Autonomous helicopter, handwriting recognition, most of Natural Language Processing (NLP), Computer Vision.
* Self-customizing programs
    * E.g., Amazon, Netflix product recommendations
* Understanding human learning (brain, real AI).

## 1.3 What is machine learning

### Machine Learning definition

* Arthur Samuel (1959). Machine Learning: Field of study that gives computers the ability to learn without being explicitly programmed.
* Tom Mitchell (1998) Well-posed Learning Problem: A computer program is said to learn from experience E with respect to some task T and some performance measure P, if its performance on T as measured by P improves with experience E.

### Machine learning algorithms:

* Supervised learning
* Unsupervised learning

Others: Reinforcement learning, recommender systems.

Also talk about: Practice advice for applying learning algorigthms.

## 1.4 Supervised Learning

"right answers" given

* Regression problem
    * Predict continuous valued output (price)
    * E.g., housing price prediction.
* Classfication problem
    * Discrete valued output (0 or 1, or more)
    * Multiple/Infinite features might be considered, e.g., tumor size, age, clump thickness, uniformity of cell size, uniformity of cell shape
    * E.g., breast cancer (malignant, benign),

## 1.5 Unsupervised Learning

no "right answers" given

E.g., Google News, Organize computing clusters, Social network analysis, Market segmentation, Astronomical data analysis

### Cocktail party problem

Cocktail party problem algorithm, in ``Octave``:

``[W,s,v] = svd((repmat(sum(x.*x,1),size(x,1),1).*x)*x');``

# 2 Linear regression with one variable

## 2.1 Model representation

**Supervised Learning**: Given the "right answer" for each example in the data.

**Regression Problem**: Predict real-valued output.

* Training Set => Learning Algorithm => h (hepothesis)
* Size of house => h => Estimated price

How to represent h ? \\(h_θ(x) = Θ_0 + Θ_1x\\)


