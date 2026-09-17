/**
 * Daily Grind Tracker — Skill Quiz Arena Engine
 * Topics: Data Science, Web Development, AI / ML
 * Tiers: Beginner, Intermediate, Advanced
 * 10 questions per quiz session with 120s (2 min) timer per question.
 * Luck-based trophy roll: 1 to 10 trophies (low ratio for 10).
 */

(function () {
  const QUIZ_BANK = {
    datascience: {
      title: "Data Science",
      icon: "📊",
      beginner: [
        {
          id: "ds_b_1",
          q: "What is the primary difference between `.loc` and `.iloc` in Pandas?",
          code: `# Example Pandas DataFrame
import pandas as pd
df = pd.DataFrame({'val': [10, 20, 30]}, index=['a', 'b', 'c'])`,
          options: [
            ".loc is label-based indexing, while .iloc is integer position-based indexing.",
            ".iloc is label-based indexing, while .loc is integer position-based indexing.",
            ".loc modifies the DataFrame in-place, while .iloc creates a shallow copy.",
            "There is no difference; they are interchangeable aliases."
          ],
          answer: 0,
          explanation: ".loc selects rows and columns using explicit index/column labels, whereas .iloc selects using integer 0-indexed positions."
        },
        {
          id: "ds_b_2",
          q: "What will be the output of the following NumPy broadcasting operation?",
          code: `import numpy as np
a = np.array([1, 2, 3])
b = 2
print(a * b)`,
          options: [
            "[1, 2, 3, 1, 2, 3]",
            "[2, 4, 6]",
            "TypeError: Cannot multiply array by scalar",
            "[[2], [4], [6]]"
          ],
          answer: 1,
          explanation: "NumPy broadcasts the scalar 2 across all elements of array 'a', performing element-wise multiplication resulting in [2, 4, 6]."
        },
        {
          id: "ds_b_3",
          q: "Which metric is most resilient when describing the central tendency of a skewed dataset with extreme outliers?",
          code: `salaries = [25000, 28000, 30000, 32000, 35000, 15000000]`,
          options: [
            "Mean (Arithmetic Average)",
            "Median (50th Percentile)",
            "Standard Deviation",
            "Variance"
          ],
          answer: 1,
          explanation: "The median represents the middle value of sorted data and is unaffected by extreme outliers, unlike the mean which gets heavily distorted."
        },
        {
          id: "ds_b_4",
          q: "What is the correct Pandas method to count total missing (NaN) values per column?",
          code: `# Inspect missing data
df.____().sum()`,
          options: [
            "df.drop_duplicates()",
            "df.isna() or df.isnull()",
            "df.fillna()",
            "df.unique()"
          ],
          answer: 1,
          explanation: "df.isna() (or df.isnull()) returns a boolean mask of True for NaNs, and chaining .sum() sums True (as 1) for each column."
        },
        {
          id: "ds_b_5",
          q: "In SQL, what is the key difference between the WHERE clause and the HAVING clause?",
          code: `SELECT department, AVG(salary) 
FROM employees 
WHERE age > 25 
GROUP BY department 
HAVING AVG(salary) > 50000;`,
          options: [
            "WHERE filters rows before aggregation; HAVING filters aggregated groups.",
            "HAVING filters rows before aggregation; WHERE filters aggregated groups.",
            "WHERE works only on numeric columns; HAVING works on text columns.",
            "There is no difference; HAVING is just legacy SQL syntax."
          ],
          answer: 0,
          explanation: "WHERE filters individual table records prior to GROUP BY aggregation. HAVING filters grouped rows after aggregate functions (like AVG, SUM) have executed."
        },
        {
          id: "ds_b_6",
          q: "What type of chart is ideal for visualizing the continuous frequency distribution of a single numerical variable?",
          code: `import matplotlib.pyplot as plt
# Which plot visualizes distribution with binned intervals?`,
          options: [
            "Histogram",
            "Pie Chart",
            "Scatter Plot",
            "Radar Chart"
          ],
          answer: 0,
          explanation: "A histogram groups continuous numeric data into bins and plots the count/density of observations in each interval."
        },
        {
          id: "ds_b_7",
          q: "What does the \`df.drop_duplicates(inplace=True)\` statement do in Pandas?",
          code: `import pandas as pd
df = pd.DataFrame({'id': [1, 2, 2, 3], 'item': ['A', 'B', 'B', 'C']})
df.drop_duplicates(inplace=True)`,
          options: [
            "Removes duplicate rows directly on 'df' without returning a new DataFrame.",
            "Creates a copy with duplicates removed and leaves 'df' unchanged.",
            "Deletes the first row of every duplicate group.",
            "Throws an error if any index label is repeated."
          ],
          answer: 0,
          explanation: "Setting inplace=True modifies the original DataFrame directly and returns None."
        },
        {
          id: "ds_b_8",
          q: "Why should you split data into Train and Test sets BEFORE performing feature scaling or imputation?",
          code: `from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)`,
          options: [
            "To prevent Data Leakage from the test set into the training process.",
            "Because scikit-learn models crash if test sets are scaled.",
            "To make gradient descent converge faster on the CPU.",
            "It is optional and does not affect model performance."
          ],
          answer: 0,
          explanation: "Fitting scalers/imputers on the entire dataset leaks distribution parameters (mean, variance) of the test set into the training set, causing overly optimistic validation metrics."
        },
        {
          id: "ds_b_9",
          q: "What will \`df['category'].astype('category')\` achieve for low-cardinality string columns?",
          code: `# High volume dataset with 1,000,000 rows
df['country'] = df['country'].astype('category')`,
          options: [
            "Substantially reduces memory footprint by storing integers mapped to unique strings.",
            "Encodes the column as binary one-hot vectors.",
            "Deletes all strings longer than 10 characters.",
            "Sorts the column in alphabetical order permanently."
          ],
          answer: 0,
          explanation: "Pandas categorical dtype stores distinct string values once in a dictionary and represents column values as compact integer codes, saving significant RAM."
        },
        {
          id: "ds_b_10",
          q: "In SQL, what kind of JOIN returns all records from Table A, and matching records from Table B (with NULLs for non-matches)?",
          code: `SELECT A.user_id, B.order_id 
FROM Users A 
____ Orders B ON A.user_id = B.user_id;`,
          options: [
            "LEFT JOIN (or LEFT OUTER JOIN)",
            "INNER JOIN",
            "RIGHT JOIN",
            "CROSS JOIN"
          ],
          answer: 0,
          explanation: "LEFT JOIN preserves every row from the left table (Users) and fills missing matches from the right table (Orders) with NULL."
        }
      ],
      intermediate: [
        {
          id: "ds_i_1",
          q: "Which technique is most efficient for conditional column creation on a 10M row DataFrame?",
          code: `# Option A: df['tier'] = df['score'].apply(lambda x: 'Pass' if x >= 70 else 'Fail')
# Option B: df['tier'] = np.where(df['score'] >= 70, 'Pass', 'Fail')`,
          options: [
            "Option B (np.where) because it runs in compiled C vectorization without Python function overhead.",
            "Option A (df.apply) because lambda functions run parallelized by default.",
            "Both have identical performance since both are executed in Pandas.",
            "Iterating through the DataFrame with a for-loop and df.iloc."
          ],
          answer: 0,
          explanation: "np.where executes at C-speed in vectorized contiguous memory, easily 20x to 100x faster than df.apply which invokes Python bytecode per row."
        },
        {
          id: "ds_i_2",
          q: "According to NumPy broadcasting rules, will arrays with shapes (4, 1, 3) and (2, 3) broadcast together?",
          code: `import numpy as np
x = np.ones((4, 1, 3))
y = np.ones((2, 3))
z = x + y`,
          options: [
            "Yes, resulting in an array of shape (4, 2, 3).",
            "No, it throws ValueError: operands could not be broadcast together.",
            "Yes, resulting in an array of shape (4, 1, 3).",
            "Yes, but only if both arrays have dtype float64."
          ],
          answer: 0,
          explanation: "Aligning trailing dimensions: (4, 1, 3) and (1, 2, 3) -> dimension 1 and 2 match with 1 expanding to 2. The broadcast shape is (4, 2, 3)."
        },
        {
          id: "ds_i_3",
          q: "What is the difference between \`RANK()\` and \`DENSE_RANK()\` in SQL window functions?",
          code: `SELECT student, score,
       RANK() OVER (ORDER BY score DESC) as rnk,
       DENSE_RANK() OVER (ORDER BY score DESC) as dense_rnk
FROM exam;`,
          options: [
            "RANK leaves gaps in ranking after ties (e.g. 1, 2, 2, 4); DENSE_RANK leaves no gaps (e.g. 1, 2, 2, 3).",
            "DENSE_RANK leaves gaps in ranking after ties; RANK leaves no gaps.",
            "RANK works on text fields only; DENSE_RANK works on numeric fields only.",
            "RANK sorts in ascending order; DENSE_RANK sorts in descending order."
          ],
          answer: 0,
          explanation: "RANK skips subsequent ranks equal to the number of ties. DENSE_RANK assigns consecutive integers without any gaps."
        },
        {
          id: "ds_i_4",
          q: "When training a K-Nearest Neighbors (KNN) or SVM classifier, why is feature scaling mandatory, but optional for Decision Trees?",
          code: `# Comparing scaling requirement
# Model 1: KNN (Euclidean distance)
# Model 2: XGBoost / Decision Tree`,
          options: [
            "KNN relies on geometric distance calculations where large-scale features dominate; tree models split along single orthogonal dimensions invariant to monotonic scale.",
            "Decision trees normalize features internally using batch norm.",
            "KNN handles categorical data natively, so scaling is needed for numbers.",
            "Scaling is mandatory for both; trees will error without StandardScaler."
          ],
          answer: 0,
          explanation: "Distance-based models (KNN, SVM, K-Means) compute Euclidean or Manhattan distance, so unscaled features with large ranges distort distance. Trees make threshold splits (x >= c) which are scale-invariant."
        },
        {
          id: "ds_i_5",
          q: "In an imbalanced dataset (99% Legitimate, 1% Fraud), which evaluation metric is LEAST informative?",
          code: `# Fraud Detection Dataset
# True Negatives: 990, False Positives: 0
# False Negatives: 10, True Positives: 0`,
          options: [
            "Overall Accuracy",
            "Precision-Recall AUC (PR-AUC)",
            "F1-Score",
            "Recall on Fraud Class"
          ],
          answer: 0,
          explanation: "A naive model predicting 'Legitimate' for every transaction achieves 99% accuracy while detecting zero fraud cases. PR-AUC, Recall, and F1-score reveal the true performance."
        },
        {
          id: "ds_i_6",
          q: "What diagnostic tool is used to detect multicollinearity among independent regression variables?",
          code: `# Checking collinearity between predictors
from statsmodels.stats.outliers_influence import variance_inflation_factor`,
          options: [
            "Variance Inflation Factor (VIF)",
            "Durbin-Watson Statistic",
            "Silhouette Score",
            "Confusion Matrix"
          ],
          answer: 0,
          explanation: "VIF measures how much the variance of an estimated regression coefficient increases when predictors are correlated. VIF > 5 or 10 indicates severe multicollinearity."
        },
        {
          id: "ds_i_7",
          q: "What does \`df.groupby('dept').agg(avg_sal=('salary', 'mean'), staff_count=('id', 'count'))\` do in Pandas?",
          code: `# Named aggregations in modern Pandas
summary = df.groupby('dept').agg(
    avg_sal=('salary', 'mean'),
    staff_count=('id', 'count')
)`,
          options: [
            "Performs multiple column aggregations returning clean, non-hierarchical column names ('avg_sal' and 'staff_count').",
            "Throws a MultiIndex error because tuple arguments are invalid in .agg().",
            "Sorts the DataFrame by department without grouping.",
            "Calculates the global average salary across all departments."
          ],
          answer: 0,
          explanation: "Pandas named aggregation syntax assigns clean, single-level column names for specific aggregated columns without creating ugly MultiIndex columns."
        },
        {
          id: "ds_i_8",
          q: "What is the primary advantage of Stratified K-Fold cross-validation over standard K-Fold?",
          code: `from sklearn.model_selection import StratifiedKFold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)`,
          options: [
            "Ensures each fold contains approximately the same percentage of target class labels as the complete dataset.",
            "Trains models 5x faster by skipping validation testing on odd folds.",
            "Prevents overfitting on continuous regression target variables.",
            "Automatically cleans outliers from the training partitions."
          ],
          answer: 0,
          explanation: "Stratified K-Fold preserves the class proportion in each fold, preventing scenarios where a fold accidentally lacks rare class samples in classification problems."
        },
        {
          id: "ds_i_9",
          q: "What is the difference between Pearson correlation and Spearman rank correlation?",
          code: `# Comparing correlation types
r_pearson = df.corr(method='pearson')
r_spearman = df.corr(method='spearman')`,
          options: [
            "Pearson evaluates linear relationships; Spearman evaluates monotonic relationships using ranks.",
            "Pearson works only on categorical data; Spearman works on numeric data.",
            "Spearman can only return values between 0 and 1; Pearson returns -1 to +1.",
            "There is no difference; they yield identical values."
          ],
          answer: 0,
          explanation: "Pearson assumes normality and measures strict linear association. Spearman computes Pearson correlation on ranked values, detecting monotonic curves even when non-linear."
        },
        {
          id: "ds_i_10",
          q: "What will the SQL \`COALESCE(bonus, commission, 0)\` expression return for a row where \`bonus\` is NULL and \`commission\` is 250?",
          code: `SELECT employee_id, COALESCE(bonus, commission, 0) AS total_extra
FROM payroll;`,
          options: [
            "250",
            "NULL",
            "0",
            "SyntaxError"
          ],
          answer: 0,
          explanation: "COALESCE evaluates its arguments in sequence and returns the first non-NULL value encountered (in this case, commission = 250)."
        }
      ],
      advanced: [
        {
          id: "ds_a_1",
          q: "In high-throughput Pandas pipelines, what is memory downcasting and why is it critical?",
          code: `# Downcasting numeric types
pd.to_numeric(df['count'], downcast='integer')
pd.to_numeric(df['rate'], downcast='float')`,
          options: [
            "Converts default 64-bit integers and floats (int64/float64) into the smallest lossless types (int8/int16/float32), cutting RAM usage by 50-75%.",
            "Truncates decimal precision to zero places for integer safety.",
            "Transfers DataFrame memory from RAM to GPU VRAM.",
            "Deletes negative values from numeric series."
          ],
          answer: 0,
          explanation: "Python/Pandas defaults to 8-byte (64-bit) numeric types. Downcasting checks values and switches to int8 (1 byte), int16 (2 bytes), or float32, reducing memory footprints drastically."
        },
        {
          id: "ds_a_2",
          q: "What causes \`numpy.ndarray.strides\` to differ between C-contiguous and Fortran-contiguous arrays?",
          code: `import numpy as np
a = np.zeros((3, 4), order='C')
b = np.zeros((3, 4), order='F')
print(a.strides, b.strides)`,
          options: [
            "C-order stores row-major (consecutive row elements contiguous), while F-order stores column-major (consecutive column elements contiguous).",
            "C-order requires 64-bit pointers; F-order requires 32-bit pointers.",
            "C-order arrays are read-only views; F-order arrays are mutable buffers.",
            "F-order is only supported on Fortran-compiled CPUs."
          ],
          answer: 0,
          explanation: "In C-order (row-major), stepping to the next row skips 4*8=32 bytes; in F-order (column-major), stepping down a column is contiguous (8 bytes) and stepping across rows skips 3*8=24 bytes."
        },
        {
          id: "ds_a_3",
          q: "In the mathematical decomposition of Expected Prediction Error (MSE), what are the three core components?",
          code: `E[(y - f_hat(x))^2] = ? + ? + ?`,
          options: [
            "Bias^2 + Variance + Irreducible Noise (sigma^2)",
            "Precision + Recall + Specificity",
            "Entropy + Gini Impurity + Residuals",
            "L1 Penalty + L2 Penalty + Learning Rate"
          ],
          answer: 0,
          explanation: "Mean Squared Error decomposes into squared model bias (underfitting), model variance (sensitivity to train fluctuations), and irreducible noise in the true data generating process."
        },
        {
          id: "ds_a_4",
          q: "In Principal Component Analysis (PCA), what do the Eigenvectors of the covariance matrix represent?",
          code: `from sklearn.decomposition import PCA
pca = PCA(n_components=2)
pca.fit(X_scaled)`,
          options: [
            "The orthogonal directions (principal axes) of maximum variance in the feature space.",
            "The proportion of explained variance per feature.",
            "The cluster centroids of the observations.",
            "The p-values of feature significance."
          ],
          answer: 0,
          explanation: "Eigenvectors define the orthogonal directions along which the data varies most. The corresponding eigenvalues quantify the amount of variance captured along each axis."
        },
        {
          id: "ds_a_5",
          q: "Why is standard K-Fold cross-validation invalid for sequential Time Series forecasting?",
          code: `# Time series model validation
# Why is KFold(n_splits=5, shuffle=True) dangerous?`,
          options: [
            "It shuffles future observations into the training set, causing lookahead bias (data leakage from the future).",
            "Time series models can only be evaluated on single train-test splits.",
            "K-Fold fails because time series data cannot be converted to floats.",
            "Auto-regressive models do not allow cross-validation."
          ],
          answer: 0,
          explanation: "Shuffling time-series data allows future records to train past predictions. Walk-forward validation (TimeSeriesSplit) must be used to preserve temporal causality."
        },
        {
          id: "ds_a_6",
          q: "What is the computational complexity of the naive Exact K-Means clustering iteration with N points, K clusters, and D dimensions?",
          code: `# K-Means convergence step: assigning N samples to K centroids in D-dim`,
          options: [
            "O(N * K * D)",
            "O(N^2 * D)",
            "O(K^3 * N)",
            "O(log(N) * K)"
          ],
          answer: 0,
          explanation: "In each iteration, distance must be calculated from each of the N points to each of the K centroids across all D feature dimensions, yielding O(N * K * D) operations."
        },
        {
          id: "ds_a_7",
          q: "What is Tree SHAP (SHapley Additive exPlanations) and why is it preferred over permutation feature importance?",
          code: `import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)`,
          options: [
            "It computes exact game-theoretic Shapley values in polynomial time for trees, providing consistent local feature contributions with additive efficiency.",
            "It only computes global importance by dropping columns one by one.",
            "It trains a secondary neural network to mimic the tree model.",
            "It requires synthetic noise injection to compute feature sensitivity."
          ],
          answer: 0,
          explanation: "Tree SHAP exploits tree structures to compute exact Shapley values in O(T * L * D^2) time, guaranteeing fairness axioms (local accuracy, missingness, consistency) across individual predictions."
        },
        {
          id: "ds_a_8",
          q: "What SQL construct is required to traverse an organization hierarchy (e.g. employee -> manager -> executive)?",
          code: `WITH RECURSIVE OrgTree AS (
  SELECT emp_id, manager_id, 1 as level FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.emp_id, e.manager_id, ot.level + 1
  FROM employees e JOIN OrgTree ot ON e.manager_id = ot.emp_id
)
SELECT * FROM OrgTree;`,
          options: [
            "Recursive Common Table Expression (CTE)",
            "Window Aggregate with PARTITION BY",
            "CROSS APPLY with Subquery",
            "PIVOT Table statement"
          ],
          answer: 0,
          explanation: "Recursive CTEs contain an anchor query combined with a recursive query that repeatedly references the CTE until an empty set is returned, ideal for graphs and trees."
        },
        {
          id: "ds_a_9",
          q: "What is the primary benefit of Optuna (Bayesian Optimization via Tree-structured Parzen Estimators - TPE) over Grid Search?",
          code: `import optuna
def objective(trial):
    lr = trial.suggest_float("lr", 1e-4, 1e-1, log=True)
    ...`,
          options: [
            "It models the probability of objective function scores conditioned on past parameter trials, focusing search in high-performing regions.",
            "It tests every permutation deterministically across a linear grid.",
            "It eliminates the need for cross-validation on validation sets.",
            "It converts non-convex optimization problems into convex quadratic programs."
          ],
          answer: 0,
          explanation: "Bayesian optimization constructs a surrogate model of the objective function, balancing exploration and exploitation to converge on optimal hyperparameters with far fewer trials."
        },
        {
          id: "ds_a_10",
          q: "To build a robust production scikit-learn pipeline, what custom class must feature transformers inherit from?",
          code: `from sklearn.base import BaseEstimator, TransformerMixin

class OutlierCapper(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None): return self
    def transform(self, X): ...`,
          options: [
            "BaseEstimator and TransformerMixin",
            "nn.Module and ClassifierMixin",
            "DataFrame and Series",
            "ProcessPoolExecutor and Pipeline"
          ],
          answer: 0,
          explanation: "Inheriting from BaseEstimator provides get_params/set_params for hyperparameter tuning; TransformerMixin automatically provides fit_transform() from fit() and transform()."
        }
      ]
    },

    webdev: {
      title: "Web Development",
      icon: "🌐",
      beginner: [
        {
          id: "wd_b_1",
          q: "What is the CSS Box Model composed of from inside to outside?",
          code: `/* Standard CSS Box Model calculation */
.box { box-sizing: content-box; }`,
          options: [
            "Content → Padding → Border → Margin",
            "Content → Margin → Border → Padding",
            "Padding → Content → Border → Margin",
            "Border → Padding → Content → Margin"
          ],
          answer: 0,
          explanation: "The CSS box model layers outwards: actual Content, surrounded by Padding, enclosed by the Border, and separated from neighbors by Margin."
        },
        {
          id: "wd_b_2",
          q: "What is the difference between \`let\` and \`var\` in modern JavaScript?",
          code: `function test() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  console.log(x); // ?
  console.log(y); // ?
}`,
          options: [
            "\`x\` prints 1 because \`var\` is function-scoped; \`y\` throws ReferenceError because \`let\` is block-scoped.",
            "\`y\` prints 2 because \`let\` is function-scoped; \`x\` throws ReferenceError.",
            "Both print successfully because JavaScript scopes all variables globally.",
            "Both throw ReferenceError inside function bodies."
          ],
          answer: 0,
          explanation: "var is hoisted and scoped to the enclosing function. let and const are strictly scoped to the enclosing block ({ ... }), throwing ReferenceError if accessed outside."
        },
        {
          id: "wd_b_3",
          q: "What will the following strict equality comparison evaluate to?",
          code: `console.log(0 == false);
console.log(0 === false);`,
          options: [
            "true, followed by false",
            "false, followed by false",
            "true, followed by true",
            "TypeError"
          ],
          answer: 0,
          explanation: "Loose equality (==) coerces false to 0, evaluating to true. Strict equality (===) checks both value and type without coercion (number vs boolean), evaluating to false."
        },
        {
          id: "wd_b_4",
          q: "In Flexbox, which property aligns items along the main axis, and which aligns along the cross axis?",
          code: `.container {
  display: flex;
  ____: center; /* Main axis */
  ____: center; /* Cross axis */
}`,
          options: [
            "justify-content for main axis; align-items for cross axis.",
            "align-items for main axis; justify-content for cross axis.",
            "flex-direction for main axis; flex-wrap for cross axis.",
            "align-content for main axis; justify-items for cross axis."
          ],
          answer: 0,
          explanation: "justify-content controls alignment along the main axis (horizontal by default), while align-items controls alignment across the perpendicular cross axis."
        },
        {
          id: "wd_b_5",
          q: "What does \`event.preventDefault()\` do when attached to a form submit event?",
          code: `form.addEventListener('submit', (e) => {
  e.preventDefault();
  // ... custom JS logic
});`,
          options: [
            "Stops the browser from executing its default full-page reload on form submission.",
            "Prevents the event from bubbling up to parent DOM elements.",
            "Clears all input values in the form automatically.",
            "Disables all submit buttons on the entire web page."
          ],
          answer: 0,
          explanation: "event.preventDefault() stops the default browser action (such as navigating to the form action URL and reloading the page), enabling client-side SPA handling."
        },
        {
          id: "wd_b_6",
          q: "Which array method creates a new array populated with the results of calling a function on every element?",
          code: `const numbers = [1, 2, 3];
const doubled = numbers.____(n => n * 2); // [2, 4, 6]`,
          options: [
            "map()",
            "forEach()",
            "filter()",
            "reduce()"
          ],
          answer: 0,
          explanation: "map() transforms each element and returns a new array of identical length without mutating the original array."
        },
        {
          id: "wd_b_7",
          q: "What is the CSS specificity order from lowest to highest?",
          code: `/* Specificity calculation */
1. p { color: blue; }
2. .card { color: red; }
3. #main { color: green; }
4. style="color: yellow"`,
          options: [
            "Element (Type) < Class/Attribute < ID < Inline style",
            "Class < Element < Inline style < ID",
            "ID < Class < Element < Inline style",
            "Inline style < ID < Class < Element"
          ],
          answer: 0,
          explanation: "Standard CSS specificity weight: Universal (0) < Element (1) < Class/pseudo-class (10) < ID (100) < Inline style (1000) < !important."
        },
        {
          id: "wd_b_8",
          q: "What will \`JSON.parse('{\"name\":\"Alex\",\"age\":24}')\` produce in JavaScript?",
          code: `const str = '{"name":"Alex","age":24}';
const obj = JSON.parse(str);`,
          options: [
            "A JavaScript Object: { name: 'Alex', age: 24 }",
            "A plain string identical to input",
            "An array of strings: ['Alex', '24']",
            "A DOM Node object"
          ],
          answer: 0,
          explanation: "JSON.parse() deserializes a standard JSON formatted string into corresponding JavaScript native data structures."
        },
        {
          id: "wd_b_9",
          q: "Which semantic HTML5 element represents self-contained, independently distributable content (e.g. a blog post or news story)?",
          code: `<!-- Semantic HTML5 architecture -->
<____>
  <h2>Breaking Tech News</h2>
  <p>Article content goes here...</p>
</____>`,
          options: [
            "<article>",
            "<section>",
            "<div>",
            "<aside>"
          ],
          answer: 0,
          explanation: "<article> denotes standalone reusable content that makes sense on its own. <section> represents a generic thematic grouping of content."
        },
        {
          id: "wd_b_10",
          q: "What will \`typeof null\` return in JavaScript?",
          code: `console.log(typeof null);`,
          options: [
            "'object'",
            "'null'",
            "'undefined'",
            "'boolean'"
          ],
          answer: 0,
          explanation: "In JavaScript, typeof null returning 'object' is an infamous historical bug from the first 1995 JS engine (type tag for objects was 0, and null pointer was 0x00)."
        }
      ],
      intermediate: [
        {
          id: "wd_i_1",
          q: "In the JavaScript Event Loop, in what exact order are these logs printed?",
          code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
          options: [
            "1, 4, 3, 2",
            "1, 2, 3, 4",
            "1, 4, 2, 3",
            "1, 3, 4, 2"
          ],
          answer: 0,
          explanation: "Synchronous code runs first ('1', '4'). Next, the microtask queue drains Promises ('3'). Finally, the macrotask queue executes setTimeout callbacks ('2')."
        },
        {
          id: "wd_i_2",
          q: "What will the following closure snippet output?",
          code: `function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const c1 = createCounter();
const c2 = createCounter();
console.log(c1(), c1(), c2());`,
          options: [
            "1 2 1",
            "1 1 1",
            "1 2 3",
            "ReferenceError: count is not defined"
          ],
          answer: 0,
          explanation: "Each invocation of createCounter() creates a distinct lexical environment. c1 maintains its own 'count' (1 then 2), while c2 has an isolated 'count' initialized to 1."
        },
        {
          id: "wd_i_3",
          q: "How does \`Promise.all\` differ from \`Promise.allSettled\` when one promise rejects?",
          code: `const p1 = Promise.resolve('Success');
const p2 = Promise.reject(new Error('Failed'));
// Comparing Promise.all([p1, p2]) vs Promise.allSettled([p1, p2])`,
          options: [
            "Promise.all immediately rejects with the first error; Promise.allSettled waits for all promises to finish and returns an array of status objects.",
            "Promise.allSettled rejects; Promise.all ignores errors and returns resolved values.",
            "Both reject immediately upon any error.",
            "Promise.all returns a boolean; Promise.allSettled returns values."
          ],
          answer: 0,
          explanation: "Promise.all employs short-circuit rejection. Promise.allSettled guarantees completion of every promise, returning { status: 'fulfilled'|'rejected', value|reason }."
        },
        {
          id: "wd_i_4",
          q: "What does the modern CSS Grid expression \`repeat(auto-fit, minmax(250px, 1fr))\` accomplish?",
          code: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}`,
          options: [
            "Creates fully responsive columns that wrap without media queries, maintaining at least 250px and expanding equally to fill spare space.",
            "Fixes exactly 4 columns across all screens.",
            "Forces every row to have a height of 250px.",
            "Disables grid layout on mobile screens."
          ],
          answer: 0,
          explanation: "auto-fit fits as many 250px columns into the track as possible, and minmax(250px, 1fr) expands them to share remaining width, creating fluid responsive layouts."
        },
        {
          id: "wd_i_5",
          q: "What is the difference between debouncing and throttling a function?",
          code: `// Window resize or search input handler
const handleSearch = debounce(searchApi, 300);
const handleScroll = throttle(updatePosition, 100);`,
          options: [
            "Debounce waits until events stop firing for X ms before executing; throttle ensures execution at most once every X ms interval.",
            "Throttle waits until events stop; debounce executes continuously.",
            "Debounce works on CSS; throttle works on JavaScript memory.",
            "There is no functional difference; they are aliases."
          ],
          answer: 0,
          explanation: "Debounce delays invocation until a period of inactivity passes (perfect for search inputs). Throttle enforces a maximum rate of calls over time (ideal for scroll listeners)."
        },
        {
          id: "wd_i_6",
          q: "Which HTTP response status code should a REST API return when a resource has been successfully created?",
          code: `POST /api/tasks
Payload: { "title": "Review PR" }
Response Status: ?`,
          options: [
            "201 Created",
            "200 OK",
            "204 No Content",
            "202 Accepted"
          ],
          answer: 0,
          explanation: "201 Created indicates successful request and resulting creation of one or more new resources, typically accompanied by a Location header."
        },
        {
          id: "wd_i_7",
          q: "How does \`this\` keyword resolve inside an arrow function compared to a standard function?",
          code: `const obj = {
  name: 'Tracker',
  regular: function() { return this.name; },
  arrow: () => this.name
};`,
          options: [
            "Arrow functions do not bind their own \`this\`; they lexically inherit \`this\` from the surrounding enclosing scope.",
            "Arrow functions always bind \`this\` to the object containing them.",
            "Arrow functions bind \`this\` to undefined in strict mode.",
            "Regular functions can never access \`this\`."
          ],
          answer: 0,
          explanation: "Arrow functions do not have their own this context. They capture the this value of the enclosing lexical execution context at the time they are created."
        },
        {
          id: "wd_i_8",
          q: "Why should sensitive authentication tokens be stored in \`HttpOnly\` cookies rather than \`localStorage\`?",
          code: `Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict`,
          options: [
            "HttpOnly cookies cannot be read or stolen by client-side JavaScript, protecting against Cross-Site Scripting (XSS) token theft.",
            "localStorage has a 5KB limit while cookies can store 50MB.",
            "localStorage is cleared every time the user closes the browser tab.",
            "Cookies encrypt the payload automatically using SHA-256."
          ],
          answer: 0,
          explanation: "If a web app suffers from an XSS vulnerability, malicious scripts can read localStorage.getItem('token'). HttpOnly cookies cannot be accessed by document.cookie or JS."
        },
        {
          id: "wd_i_9",
          q: "What causes a browser to send an HTTP \`OPTIONS\` preflight request before a fetch request?",
          code: `fetch('https://api.example.com/data', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' }
});`,
          options: [
            "Cross-origin requests using methods other than GET/POST/HEAD, or custom headers like Content-Type: application/json.",
            "Whenever the request body exceeds 1 Kilobyte.",
            "Only when the browser is operating in Incognito / Private mode.",
            "Every single HTTPS request automatically sends an OPTIONS preflight."
          ],
          answer: 0,
          explanation: "Under CORS rules, any cross-origin request that is not a 'simple request' (e.g., using PUT/DELETE, or non-simple Content-Type like application/json) triggers an OPTIONS preflight check."
        },
        {
          id: "wd_i_10",
          q: "What does \`AbortController\` enable in modern JavaScript fetch requests?",
          code: `const controller = new AbortController();
fetch(url, { signal: controller.signal });
// Later: controller.abort();`,
          options: [
            "Allows programmatic cancellation of pending HTTP network requests (e.g. on unmount or user timeout).",
            "Pauses the server-side database transaction.",
            "Reroutes the request through an HTTP proxy.",
            "Clears the browser HTTP disk cache."
          ],
          answer: 0,
          explanation: "AbortController creates an abort signal that can be passed to fetch(), cancelable via controller.abort(), which rejects the fetch promise with an AbortError."
        }
      ],
      advanced: [
        {
          id: "wd_a_1",
          q: "In browser rendering pipelines, what triggers a Layout (Reflow) versus a Repaint, and why is Reflow more expensive?",
          code: `// Operation A: element.style.color = 'red';
// Operation B: element.style.width = '200px';`,
          options: [
            "Width changes geometry/dimensions requiring recalculation of positions for the element and its descendants/ancestors (Reflow); color only modifies pixel appearance without geometric changes (Repaint).",
            "Repaints recalculate the DOM tree; Reflows only change colors.",
            "Both have identical GPU overhead on modern multi-core systems.",
            "Reflow executes entirely on the GPU; Repaint runs on the CPU."
          ],
          answer: 0,
          explanation: "Reflow (Layout) determines geometric dimensions and positioning of nodes in the document. Changing width/height/margin invalidates layout and cascades to other elements, whereas color changes only trigger Repaint."
        },
        {
          id: "wd_a_2",
          q: "What is 'Layout Thrashing' and how do you avoid it in high-frequency DOM manipulation?",
          code: `// Anti-pattern:
for (let i = 0; i < items.length; i++) {
  items[i].style.width = items[i].offsetWidth + 10 + 'px';
}`,
          options: [
            "Interleaving DOM style writes with style reads forces the browser to synchronously recalculate layout on every loop iteration; batch reads first, then batch writes (e.g. via requestAnimationFrame).",
            "Loading too many CSS files asynchronously in the document head.",
            "Running CSS transitions without hardware acceleration.",
            "Using flexbox inside of an HTML table."
          ],
          answer: 0,
          explanation: "Reading geometry (like offsetWidth) immediately after modifying styles forces synchronous layout recalibration. Batching all reads together before performing writes avoids layout thrashing."
        },
        {
          id: "wd_a_3",
          q: "How does the \`Content-Security-Policy\` (CSP) header protect against Cross-Site Scripting (XSS)?",
          code: `Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; object-src 'none';`,
          options: [
            "Restricts the origins and sources from which scripts, styles, images, and other assets can be loaded and executed by the browser.",
            "Encrypts all outgoing form payloads with public-key cryptography.",
            "Blocks cross-origin cookies from being sent in HTTP requests.",
            "Disables the browser console for unauthenticated users."
          ],
          answer: 0,
          explanation: "CSP tells the browser which dynamic resources are trusted. By forbidding inline scripts ('unsafe-inline') and untrusted external domains, injected XSS scripts fail to execute."
        },
        {
          id: "wd_a_4",
          q: "In JavaScript memory management, how does Mark-and-Sweep garbage collection prevent memory leaks from circular references?",
          code: `function setupCycle() {
  const objA = {};
  const objB = {};
  objA.ref = objB;
  objB.ref = objA;
}`,
          options: [
            "It traverses references starting from the root objects (window/global); if a group of circularly referenced objects is unreachable from the roots, they are swept and freed.",
            "It counts incoming references and frees any object when its count hits zero.",
            "It automatically breaks circular references using WeakMaps.",
            "Circular references always leak memory in all modern JavaScript engines."
          ],
          answer: 0,
          explanation: "Reference-counting algorithms leaked on circular dependencies. Modern Mark-and-Sweep tracks reachability from Roots. If isolated circular structures are disconnected from roots, they are reclaimed."
        },
        {
          id: "wd_a_5",
          q: "What role does the \`SameSite\` cookie attribute play in preventing Cross-Site Request Forgery (CSRF)?",
          code: `Set-Cookie: session_id=abc123; SameSite=Lax; Secure; HttpOnly`,
          options: [
            "Controls whether cookies are sent with cross-site requests, preventing malicious third-party sites from exploiting ambient credentials.",
            "Ensures cookies can only be accessed across subdomains of the same parent.",
            "Restricts cookie lifespan to exactly 15 minutes of idle time.",
            "Encrypts cookie content using server-side HMAC signatures."
          ],
          answer: 0,
          explanation: "SameSite=Strict prevents cookie inclusion on any cross-site request. SameSite=Lax (browser default) permits cookies only on top-level safe GET navigations, neutralizing standard CSRF attacks."
        },
        {
          id: "wd_a_6",
          q: "In Web Workers, why can you NOT directly access \`document\` or \`window\`?",
          code: `// Inside worker.js
const worker = new Worker('worker.js');`,
          options: [
            "Web Workers run on separate background OS threads with isolated global scope (\`self\`) to avoid concurrency race conditions on the non-thread-safe DOM.",
            "Because browsers disable JavaScript inside background threads.",
            "Workers can only execute compiled WebAssembly code.",
            "Workers run inside an iframe with restricted sandboxing."
          ],
          answer: 0,
          explanation: "The DOM is not thread-safe. To prevent simultaneous multi-threaded mutations, Workers execute in an isolated environment without access to window or document, communicating via postMessage."
        },
        {
          id: "wd_a_7",
          q: "What is the difference between WebSockets and Server-Sent Events (SSE)?",
          code: `// Option A: const ws = new WebSocket('wss://api.example.com/ws');
// Option B: const sse = new EventSource('/api/events');`,
          options: [
            "WebSockets provide full-duplex bidirectional TCP communication; SSE provides lightweight, unidirectional streaming from server to client over standard HTTP with built-in reconnection.",
            "SSE is bidirectional; WebSockets are unidirectional only.",
            "WebSockets work only over HTTP/1.1; SSE requires HTTP/3.",
            "SSE requires opening a raw TCP socket on custom ports."
          ],
          answer: 0,
          explanation: "WebSockets upgrade the connection for full two-way communication. SSE uses plain HTTP streaming, automatic retry, and custom event names, ideal when only the server pushes real-time updates."
        },
        {
          id: "wd_a_8",
          q: "What will \`Object.create(proto)\` do compared to \`Object.assign({}, proto)\`?",
          code: `const proto = { greet() { return 'Hi'; } };
const a = Object.create(proto);
const b = Object.assign({}, proto);`,
          options: [
            "\`a\` sets \`proto\` as the prototype in its prototype chain (\`a.__proto__ === proto\`); \`b\` copies enumerable own properties directly onto a new object.",
            "\`b\` sets the prototype; \`a\` creates a shallow copy.",
            "Both create identical objects with identical prototypes.",
            "\`Object.create\` freezes the object against future mutation."
          ],
          answer: 0,
          explanation: "Object.create(proto) creates an empty object whose hidden [[Prototype]] points to proto. Object.assign({}, proto) performs shallow property copy onto a new object whose prototype is Object.prototype."
        },
        {
          id: "wd_a_9",
          q: "In advanced TypeScript, what does the conditional mapped type \`type NonNullable<T> = T extends null | undefined ? never : T\` accomplish?",
          code: `type Input = string | number | null | undefined;
type Cleaned = NonNullable<Input>; // ?`,
          options: [
            "Filters out \`null\` and \`undefined\` from union type \`T\`, leaving only \`string | number\`.",
            "Converts all null values to empty strings at runtime.",
            "Throws a compiler error whenever null is passed.",
            "Makes all properties of an interface optional."
          ],
          answer: 0,
          explanation: "By distributing over the union, members matching null or undefined resolve to 'never' (which collapses in unions), leaving only non-null primitives."
        },
        {
          id: "wd_a_10",
          q: "What is the purpose of Service Worker Cache Storage API strategies like 'Stale-While-Revalidate'?",
          code: `self.addEventListener('fetch', (event) => {
  // Stale-While-Revalidate pattern
});`,
          options: [
            "Serves cached content immediately for instant load times, while simultaneously making a network request in the background to update the cache for next time.",
            "Always forces a fresh network download, deleting the cache on every visit.",
            "Caches assets only when the user is completely offline.",
            "Encrypts browser cookies into IndexedDB storage."
          ],
          answer: 0,
          explanation: "Stale-While-Revalidate delivers optimal performance: the client renders instantaneously using cached data, while background revalidation fetches fresh assets and updates the cache seamlessly."
        }
      ]
    },

    aiml: {
      title: "AI / Machine Learning",
      icon: "🤖",
      beginner: [
        {
          id: "ai_b_1",
          q: "What is the primary difference between Supervised and Unsupervised learning?",
          code: `# Paradigm comparison:
Dataset A: Feature matrix X with ground truth labels y
Dataset B: Feature matrix X with no labels`,
          options: [
            "Supervised learning trains on labeled data (input-output pairs); Unsupervised learning discovers hidden patterns in unlabeled data.",
            "Supervised learning uses neural networks; Unsupervised learning uses only linear regression.",
            "Unsupervised learning requires human supervision during training.",
            "There is no difference; both require ground-truth targets."
          ],
          answer: 0,
          explanation: "Supervised learning maps inputs to known target labels (classification/regression). Unsupervised learning identifies inherent clustering or dimensionality structure without target labels."
        },
        {
          id: "ai_b_2",
          q: "What problem occurs when a model achieves 99% accuracy on training data but only 55% accuracy on test data?",
          code: `Train Loss: 0.02 | Train Acc: 99.4%
Test Loss:  1.85 | Test Acc:  55.1%`,
          options: [
            "Overfitting (High Variance)",
            "Underfitting (High Bias)",
            "Data Leakage",
            "Gradient Vanishing"
          ],
          answer: 0,
          explanation: "Overfitting occurs when a model memorizes noise and specific details of the training set rather than learning generalizable patterns, causing poor performance on unseen data."
        },
        {
          id: "ai_b_3",
          q: "Why are non-linear activation functions (like ReLU or GELU) essential in deep neural networks?",
          code: `# Neural Network Layer Composition
z = W2 * (W1 * x + b1) + b2`,
          options: [
            "Without non-linearity, stacking multiple layers collapses mathematically into a single linear transformation (W2*W1 = W_equiv).",
            "They prevent the weights from becoming negative numbers.",
            "They eliminate the need for backpropagation.",
            "They convert all floating-point numbers into 8-bit integers."
          ],
          answer: 0,
          explanation: "A linear combination of linear functions is still just a linear function. Non-linear activations allow neural networks to approximate complex non-linear functions (Universal Approximation Theorem)."
        },
        {
          id: "ai_b_4",
          q: "In Gradient Descent, what happens if the learning rate (alpha) is set excessively high?",
          code: `theta = theta - alpha * gradient_cost`,
          options: [
            "The optimization can overshoot the minimum, oscillate wildly, or diverge to infinity (NaN loss).",
            "The model takes millions of iterations to make any progress.",
            "The weights are automatically set to zero.",
            "It guarantees finding the global minimum in 1 step."
          ],
          answer: 0,
          explanation: "An excessively large learning rate takes oversized steps, missing the minimum, bouncing back and forth across valleys, and causing the loss to diverge."
        },
        {
          id: "ai_b_5",
          q: "What metric is defined as True Positives / (True Positives + False Positives)?",
          code: `TP = 80, FP = 20, FN = 10, TN = 890
Metric = 80 / (80 + 20) = 0.80`,
          options: [
            "Precision",
            "Recall (Sensitivity)",
            "Specificity",
            "F1-Score"
          ],
          answer: 0,
          explanation: "Precision measures how many of the positively predicted instances were actually correct (focusing on minimizing false alarms)."
        },
        {
          id: "ai_b_6",
          q: "In K-Means clustering, what is the 'Elbow Method' used for?",
          code: `inertias = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k).fit(X)
    inertias.append(kmeans.inertia_)
# Plotting inertias vs k to find the bend`,
          options: [
            "Determining the optimal number of clusters (K) where within-cluster sum of squares (inertia) elbow bend appears.",
            "Detecting corrupted training samples.",
            "Calculating the optimal learning rate for neural networks.",
            "Measuring classification accuracy on test sets."
          ],
          answer: 0,
          explanation: "The elbow curve plots inertia vs number of clusters k. The point where the rate of decrease sharply shifts (the elbow) suggests optimal cluster count."
        },
        {
          id: "ai_b_7",
          q: "What is the primary loss function used for training binary classification models?",
          code: `L = - (y * log(p) + (1 - y) * log(1 - p))`,
          options: [
            "Binary Cross-Entropy (Log Loss)",
            "Mean Squared Error (MSE)",
            "Mean Absolute Error (MAE)",
            "Hinge Loss"
          ],
          answer: 0,
          explanation: "Binary Cross-Entropy penalizes confident wrong probability predictions heavily and matches the negative log-likelihood of Bernoulli distribution."
        },
        {
          id: "ai_b_8",
          q: "What does the \`Dropout\` layer do during neural network training?",
          code: `import torch.nn as nn
model = nn.Sequential(
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Dropout(p=0.5)
)`,
          options: [
            "Randomly zeroes out a fraction 'p' of neuron activations during training to prevent co-adaptation and reduce overfitting.",
            "Deletes 50% of the training dataset randomly.",
            "Halves the learning rate after every epoch.",
            "Removes dead neurons permanently from the model file."
          ],
          answer: 0,
          explanation: "Dropout acts as an ensemble of thinned networks by randomly turning off units during training, forcing individual neurons to learn robust features without relying on specific co-activations."
        },
        {
          id: "ai_b_9",
          q: "What is the purpose of the validation set in a Train-Validation-Test workflow?",
          code: `# Dataset Split
# 70% Train, 15% Validation, 15% Test`,
          options: [
            "To tune hyperparameters and make early-stopping decisions without touching the final test set.",
            "To train model parameters via backpropagation.",
            "To replace the training set when data is small.",
            "To store predictions for production deployment."
          ],
          answer: 0,
          explanation: "The validation set provides an unbiased evaluation during model tuning and model selection. The test set is reserved exclusively for final confirmation of generalization."
        },
        {
          id: "ai_b_10",
          q: "What is a major advantage of Random Forests over a single Decision Tree?",
          code: `from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=100)`,
          options: [
            "Aggregating predictions across multiple de-correlated trees drastically reduces variance without increasing bias.",
            "Random Forests train faster than a single shallow tree.",
            "Random Forests never require any memory to store.",
            "Random Forests can only predict continuous linear targets."
          ],
          answer: 0,
          explanation: "Single decision trees suffer from high variance (overfitting). Random forest bagging (bootstrap aggregation with random feature subsets) smooths out variance through averaging."
        }
      ],
      intermediate: [
        {
          id: "ai_i_1",
          q: "What is the fundamental difference between L1 (Lasso) and L2 (Ridge) weight regularization?",
          code: `# Regularization terms:
# L1: lambda * sum(|w_i|)
# L2: lambda * sum(w_i^2)`,
          options: [
            "L1 encourages sparse weights by driving non-critical coefficients to absolute zero (feature selection); L2 shrinks weights close to zero without zeroing them out completely.",
            "L2 produces sparse weights; L1 keeps all features non-zero.",
            "L1 can only be applied to classification; L2 only to regression.",
            "L2 eliminates the need for gradient descent."
          ],
          answer: 0,
          explanation: "L1 penalty has sharp corners on the coordinate axes (diamond constraint), driving coefficients to exact zeros (sparse solutions). L2 penalty has spherical contours, decaying weights smoothly."
        },
        {
          id: "ai_i_2",
          q: "What is the purpose of Residual Connections (Skip Connections) introduced in ResNet?",
          code: `y = F(x, {W_i}) + x`,
          options: [
            "They allow gradients to propagate directly through the identity shortcut, mitigating the vanishing gradient problem in very deep networks.",
            "They reduce the number of weights in the network by half.",
            "They replace convolutional layers with linear projections.",
            "They force the network to become recurrent."
          ],
          answer: 0,
          explanation: "In deep networks, backpropagated gradients shrink exponentially. Skip connections provide an uninterrupted gradient highway back to early layers, enabling training of networks with 100+ layers."
        },
        {
          id: "ai_i_3",
          q: "How does the Adam optimizer combine the concepts of Momentum and RMSProp?",
          code: `# Adam updates:
# m_t = beta1 * m_{t-1} + (1 - beta1) * g_t (First moment)
# v_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2 (Second moment)`,
          options: [
            "It computes exponentially decaying averages of past gradients (momentum) and past squared gradients (adaptive learning rate scaling).",
            "It uses genetic algorithms alongside gradient descent.",
            "It switches between L1 and L2 regularization every batch.",
            "It computes second-order Hessian matrices directly."
          ],
          answer: 0,
          explanation: "Adam tracks the exponentially decaying average of past gradients (momentum - 1st moment) to accelerate in consistent directions and past squared gradients (RMSProp - 2nd moment) to scale individual coordinate learning rates."
        },
        {
          id: "ai_i_4",
          q: "In Convolutional Neural Networks (CNNs), what is the receptive field of a neuron?",
          code: `layer1 = Conv2d(in=3, out=64, kernel=3)
layer2 = Conv2d(in=64, out=128, kernel=3)`,
          options: [
            "The specific region of the input image that directly influences the activation of that neuron.",
            "The total number of floating-point parameters in that layer.",
            "The memory size allocated for GPU tensor buffers.",
            "The learning rate assigned to that filter."
          ],
          answer: 0,
          explanation: "The receptive field is the sensory patch in the original input image that contributes to a particular unit's feature representation. Stacking conv layers expands the receptive field hierarchically."
        },
        {
          id: "ai_i_5",
          q: "Why do traditional Recurrent Neural Networks (RNNs) struggle with long-term dependencies compared to LSTMs?",
          code: `h_t = tanh(W_hh * h_{t-1} + W_xh * x_t)`,
          options: [
            "Repeated matrix multiplication across long time steps causes gradients to either vanish to 0 or explode to infinity; LSTMs regulate flow via additive cell state gates.",
            "RNNs cannot process sequential data longer than 10 words.",
            "RNNs require unsupervised training only.",
            "LSTMs do not use backpropagation."
          ],
          answer: 0,
          explanation: "Standard RNNs multiply by the same weight matrix across time steps, causing exponential gradient decay/explosion. LSTMs maintain a constant error carousel via forget, input, and output gates."
        },
        {
          id: "ai_i_6",
          q: "What is the role of the Softmax function in multi-class classification output layers?",
          code: `softmax(z_i) = exp(z_i) / sum(exp(z_j))`,
          options: [
            "Converts raw unnormalized model logits into a valid probability distribution that sums to 1.",
            "Eliminates negative weights from the final linear projection.",
            "Computes the classification accuracy directly.",
            "Binarizes predictions into 0 or 1."
          ],
          answer: 0,
          explanation: "Softmax exponentiates raw logits (ensuring non-negative values) and normalizes by the sum of all exponentials, producing probabilities summing strictly to 1.0."
        },
        {
          id: "ai_i_7",
          q: "In Word Embeddings (like Word2Vec), how are semantic relationships captured mathematically?",
          code: `# Vector arithmetic:
vec("King") - vec("Man") + vec("Woman") ≈ vec("Queen")`,
          options: [
            "Words appearing in similar contextual distributions map to nearby vectors in high-dimensional continuous geometric space, preserving linear semantic offsets.",
            "Words are converted to integer alphabetical order.",
            "Every word is represented as an orthogonal one-hot vector.",
            "By hashing words into a 32-bit integer array."
          ],
          answer: 0,
          explanation: "Word2Vec embeds words such that dot products reflect co-occurrence frequency. Semantic relationships (gender, tense, capital cities) emerge as consistent vector displacement directions."
        },
        {
          id: "ai_i_8",
          q: "What is Transfer Learning and why is it standard practice in Computer Vision and NLP?",
          code: `from torchvision.models import resnet50, ResNet50_Weights
model = resnet50(weights=ResNet50_Weights.DEFAULT)
model.fc = nn.Linear(2048, num_custom_classes)`,
          options: [
            "Using feature representations learned on massive datasets (e.g. ImageNet) and fine-tuning on custom tasks, saving compute and excelling with small datasets.",
            "Transferring trained models from Python to C++ automatically.",
            "Compressing neural networks onto microcontroller chips.",
            "Training a model without any target loss function."
          ],
          answer: 0,
          explanation: "Pre-trained models already understand low-level and mid-level generic features (edges, shapes, grammar). Reusing these foundational weights allows high accuracy with minimal custom labeled data."
        },
        {
          id: "ai_i_9",
          q: "What is Focal Loss designed to address in dense object detection (like RetinaNet)?",
          code: `FL(p_t) = - alpha_t * (1 - p_t)^gamma * log(p_t)`,
          options: [
            "Extreme foreground-background class imbalance by down-weighting the loss contribution from easy, well-classified background examples.",
            "Overfitting on small image resolutions.",
            "Slow inference speed on mobile devices.",
            "Color jitter distortions in data augmentation."
          ],
          answer: 0,
          explanation: "In object detection, millions of candidate anchor boxes are trivial background. Focal Loss applies a modulating factor (1 - p_t)^gamma to focus training on hard, ambiguous foreground examples."
        },
        {
          id: "ai_i_10",
          q: "What is the difference between Batch Normalization and Layer Normalization?",
          code: `# Normalization axes:
# Batch Normalization: computes statistics across batch dimension
# Layer Normalization: computes statistics across feature/channel dimension`,
          options: [
            "BatchNorm normalizes across batch samples for each feature independently; LayerNorm normalizes across all features for each individual sample independently.",
            "LayerNorm works only on CNNs; BatchNorm works only on Transformers.",
            "BatchNorm has no learnable parameters; LayerNorm has learnable parameters.",
            "There is no difference; they are mathematically identical."
          ],
          answer: 0,
          explanation: "BatchNorm computes mean and variance across the batch, making it sensitive to batch size and unsuited for varying-length sequences. LayerNorm normalizes across the feature dimension per sample, ideal for Transformers and RNNs."
        }
      ],
      advanced: [
        {
          id: "ai_a_1",
          q: "What is the exact Scaled Dot-Product Attention formula in the original Transformer architecture?",
          code: `Attention(Q, K, V) = ?`,
          options: [
            "Softmax((Q * K^T) / sqrt(d_k)) * V",
            "Sigmoid(Q * K^T) * V",
            "Softmax(Q * V^T) * K",
            "(Q * K^T) / d_k + V"
          ],
          answer: 0,
          explanation: "Attention multiplies query and key matrices, scales by 1/sqrt(d_k) to prevent dot products from growing excessively large (which would push softmax into small gradient regions), applies softmax, and weights values V."
        },
        {
          id: "ai_a_2",
          q: "Why does Multi-Head Attention project Queries, Keys, and Values into 'h' lower-dimensional subspaces?",
          code: `MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O
where head_i = Attention(Q * W_i^Q, K * W_i^K, V * W_i^V)`,
          options: [
            "It allows the model to jointly attend to information from different representation subspaces and distinct positions simultaneously.",
            "It reduces the parameter count of the Transformer to near zero.",
            "It eliminates the need for feed-forward layers in the transformer block.",
            "It prevents backpropagation from computing matrix derivatives."
          ],
          answer: 0,
          explanation: "Single-head attention averages across all features. Multi-head attention allows individual heads to specialize in different linguistic patterns (e.g. subject-verb agreement, syntactic references, positional proximity)."
        },
        {
          id: "ai_a_3",
          q: "How does Rotary Position Embedding (RoPE) inject positional awareness compared to absolute sinusoidal embeddings?",
          code: `# RoPE in LLaMA / modern LLMs:
q_m = R_theta,m * (W_q * x_m)`,
          options: [
            "It rotates the query and key vectors in 2D coordinate pairs by angles proportional to their position index, naturally decaying inner product as relative distance increases.",
            "It concatenates a one-hot position vector to the token embedding.",
            "It adds a learned bias vector to the final logits.",
            "It sorts tokens chronologically in the GPU cache."
          ],
          answer: 0,
          explanation: "RoPE applies complex orthogonal rotation matrices to 2D chunks of query and key vectors. The inner product <R_m q, R_n k> depends solely on relative offset (m - n), enabling superior context generalization."
        },
        {
          id: "ai_a_4",
          q: "In Parameter-Efficient Fine-Tuning (PEFT), how does LoRA (Low-Rank Adaptation) freeze base weights while training?",
          code: `W_updated = W_0 + (B * A) * (alpha / r)
where W_0 is (d x k) frozen, B is (d x r), A is (r x k), r << d`,
          options: [
            "It decomposes the weight update matrix delta-W into two low-rank matrices B and A (with rank r), drastically reducing trainable parameters by 99% while freezing base W_0.",
            "It quantizes all 16-bit floating point weights into 1-bit binary weights.",
            "It prunes 90% of the attention heads permanently.",
            "It adds extra layers at the very end of the network."
          ],
          answer: 0,
          explanation: "Weight updates have a low intrinsic dimension. By representing delta-W as B * A where rank r is small (e.g. r=8 or 16), LoRA trains minimal parameters without latency overhead (B*A can be folded back into W_0 at inference)."
        },
        {
          id: "ai_a_5",
          q: "What is the KV Cache in LLM autoregressive token generation and why is it critical for throughput?",
          code: `next_token = model(current_token, past_key_values=kv_cache)`,
          options: [
            "It stores the computed Key and Value matrices of all previous tokens, avoiding redundant re-computation of past attention representations on every generated token.",
            "It caches the entire vocabulary in CPU RAM.",
            "It prevents hallucination by validating grammar rules.",
            "It stores the optimizer states during forward inference."
          ],
          answer: 0,
          explanation: "Generating token N only requires calculating Key and Value for token N. Caching past K and V matrices drops single-token generation complexity from O(N^2) to O(N) per step."
        },
        {
          id: "ai_a_6",
          q: "What is the key difference between RLHF with PPO and DPO (Direct Preference Optimization)?",
          code: `# DPO Loss formulation
L_DPO = - E[log(sigmoid(beta * log(pi(y_w|x)/ref(y_w|x)) - beta * log(pi(y_l|x)/ref(y_l|x))))]`,
          options: [
            "DPO derives an analytical closed-form solution that optimizes the policy directly on preference pairs, eliminating the need to train a separate reward model or use complex PPO reinforcement learning loops.",
            "PPO requires no human preference data; DPO requires millions of examples.",
            "DPO works only on visual models; PPO works on text only.",
            "DPO requires online exploration during inference."
          ],
          answer: 0,
          explanation: "Rafailov et al. showed that the objective under the Bradley-Terry preference model can be optimized directly on the policy network, removing the instability of training separate reward models and actor-critic PPO loops."
        },
        {
          id: "ai_a_7",
          q: "What distinguishes NormalFloat4 (NF4) quantization used in QLoRA from standard uniform 4-bit integer quantization (INT4)?",
          code: `# QLoRA NF4 quantization scheme`,
          options: [
            "NF4 builds an information-theoretically optimal quantile grid assuming zero-mean normal distribution of weights, ensuring equal number of parameters in each quantization bin.",
            "NF4 rounds all weights to the nearest whole integer between 0 and 15.",
            "NF4 converts weights to 4-bit strings of ASCII characters.",
            "NF4 is a lossless compression algorithm based on Huffman coding."
          ],
          answer: 0,
          explanation: "Neural network weights follow a normal distribution. NF4 constructs quantile intervals with equal probability mass under standard Gaussian N(0, 1), minimizing quantization distortion compared to linear INT4."
        },
        {
          id: "ai_a_8",
          q: "What does FlashAttention achieve at the hardware level to accelerate attention computations?",
          code: `# Tri Dao's FlashAttention breakthrough`,
          options: [
            "Uses tiling and online softmax to compute attention block-by-block within fast GPU SRAM, avoiding slow reads/writes of N x N attention matrices to High Bandwidth Memory (HBM).",
            "Approximates attention using low-rank random Fourier features.",
            "Transfers attention computation from GPU to CPU cache.",
            "Drops 50% of the attention connections in the upper layers."
          ],
          answer: 0,
          explanation: "Standard attention is memory-bandwidth bound (reading/writing large intermediate N x N matrices to GPU HBM). FlashAttention fuses operations and computes online softmax in fast on-chip SRAM, yielding 2-4x speedups."
        },
        {
          id: "ai_a_9",
          q: "Why has RMSNorm largely replaced LayerNorm in state-of-the-art LLMs (like LLaMA and Mistral)?",
          code: `RMSNorm(x) = (x / RMS(x)) * g
where RMS(x) = sqrt((1/d) * sum(x_i^2) + epsilon)`,
          options: [
            "It drops the mean-centering step, reducing computational overhead by ~10-50% while preserving scale-invariance and training stability.",
            "It eliminates all learnable scaling parameters.",
            "It converts floating-point activations into integers.",
            "It prevents models from generating repetitive tokens."
          ],
          answer: 0,
          explanation: "Zhang & Sennrich demonstrated that the mean-centering operation in LayerNorm does not contribute to training stability. RMSNorm only scales by root mean square, saving memory operations and execution time."
        },
        {
          id: "ai_a_10",
          q: "In Vector Databases for RAG (Retrieval-Augmented Generation), what algorithm does HNSW use for Approximate Nearest Neighbor search?",
          code: `# Vector indexing: Hierarchical Navigable Small World`,
          options: [
            "Multi-layer hierarchical graphs where top layers have long-range skip connections and bottom layers have dense local clustering, providing logarithmic O(log N) search complexity.",
            "Exhaustive brute-force cosine distance across all stored vectors.",
            "Linear scanning through a B-Tree index on primary keys.",
            "Hashing vectors into fixed 1D buckets using MD5."
          ],
          answer: 0,
          explanation: "HNSW builds stratified proximity graphs inspired by skip lists. Top layers perform coarse routing with large skip distances, zooming down to dense bottom layers for precise nearest-neighbor clustering in O(log N)."
        }
      ]
    }
  };

  /* -------------------------------------------------------------
     Luck-Based Trophy Roll Engine (1 to 10 Trophies)
     Minimum = 1 Trophy, Maximum = 10 Trophies.
     10 Trophies ratio is strictly low (~1%).
  ------------------------------------------------------------- */
  function rollQuizTrophies(scoreOutOf10 = 5) {
    const roll = Math.random() * 10000;
    let earned = 1;

    // Minimum is always 1, Maximum is 10.
    // 10 is an ultra-rare jackpot (0.15% - 0.8%).
    if (scoreOutOf10 >= 8) {
      if (roll < 80) earned = 10;        // 0.8%
      else if (roll < 220) earned = 9;   // 1.4%
      else if (roll < 450) earned = 8;   // 2.3%
      else if (roll < 850) earned = 7;   // 4.0%
      else if (roll < 1500) earned = 6;  // 6.5%
      else if (roll < 2600) earned = 5;  // 11.0%
      else if (roll < 4200) earned = 4;  // 16.0%
      else if (roll < 6200) earned = 3;  // 20.0%
      else if (roll < 8200) earned = 2;  // 20.0%
      else earned = 1;                   // 18.0%
    } else if (scoreOutOf10 >= 5) {
      if (roll < 40) earned = 10;        // 0.4%
      else if (roll < 120) earned = 9;   // 0.8%
      else if (roll < 280) earned = 8;   // 1.6%
      else if (roll < 600) earned = 7;   // 3.2%
      else if (roll < 1200) earned = 6;  // 6.0%
      else if (roll < 2200) earned = 5;  // 10.0%
      else if (roll < 3800) earned = 4;  // 16.0%
      else if (roll < 5800) earned = 3;  // 20.0%
      else if (roll < 7900) earned = 2;  // 21.0%
      else earned = 1;                   // 21.0%
    } else {
      if (roll < 15) earned = 10;        // 0.15%
      else if (roll < 50) earned = 9;    // 0.35%
      else if (roll < 120) earned = 8;   // 0.7%
      else if (roll < 260) earned = 7;   // 1.4%
      else if (roll < 550) earned = 6;   // 2.9%
      else if (roll < 1100) earned = 5;  // 5.5%
      else if (roll < 2100) earned = 4;  // 10.0%
      else if (roll < 3800) earned = 3;  // 17.0%
      else if (roll < 6500) earned = 2;  // 27.0%
      else earned = 1;                   // 35.0%
    }

    return Math.max(1, Math.min(10, earned));
  }

  // Active Quiz Session State
  let session = {
    topic: null,
    level: null,
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    timeRemaining: 120, // 120 seconds max per question
    timerInterval: null,
    completed: false,
    trophiesAwarded: null,
    startedAt: null
  };

  const DailyGrindQuiz = {
    getBank() {
      return QUIZ_BANK;
    },

    getSession() {
      return session;
    },

    rollTrophies: rollQuizTrophies,

    startSession(topicKey, levelKey) {
      const topicData = QUIZ_BANK[topicKey];
      if (!topicData || !topicData[levelKey]) {
        throw new Error("Invalid topic or difficulty level chosen.");
      }

      // Clone questions
      const questions = JSON.parse(JSON.stringify(topicData[levelKey]));

      session = {
        topic: topicKey,
        topicTitle: topicData.title,
        topicIcon: topicData.icon,
        level: levelKey,
        questions,
        currentIndex: 0,
        userAnswers: new Array(questions.length).fill(null),
        timeRemaining: 120,
        timerInterval: null,
        completed: false,
        trophiesAwarded: null,
        startedAt: Date.now()
      };

      return session;
    },

    stopTimer() {
      if (session.timerInterval) {
        clearInterval(session.timerInterval);
        session.timerInterval = null;
      }
    },

    startQuestionTimer(onTick, onExpire) {
      this.stopTimer();
      session.timeRemaining = 120; // 2 minutes (120s) per question

      session.timerInterval = setInterval(() => {
        session.timeRemaining--;
        if (typeof onTick === "function") {
          onTick(session.timeRemaining);
        }

        if (session.timeRemaining <= 0) {
          this.stopTimer();
          if (typeof onExpire === "function") {
            onExpire();
          }
        }
      }, 1000);
    },

    recordAnswer(questionIndex, selectedOptionIndex) {
      if (questionIndex < 0 || questionIndex >= session.questions.length) return;
      const q = session.questions[questionIndex];
      const timeSpent = Math.max(0, 120 - session.timeRemaining);
      const isCorrect = selectedOptionIndex !== null && selectedOptionIndex === q.answer;

      session.userAnswers[questionIndex] = {
        questionId: q.id,
        selectedIndex: selectedOptionIndex,
        isCorrect,
        timeSpent
      };

      return session.userAnswers[questionIndex];
    },

    generateFinalReport() {
      this.stopTimer();
      session.completed = true;

      const total = session.questions.length;
      let correctCount = 0;
      let totalTimeSpent = 0;

      const review = session.questions.map((q, idx) => {
        const userAns = session.userAnswers[idx] || { selectedIndex: null, isCorrect: false, timeSpent: 120 };
        const isCorrect = !!userAns.isCorrect;
        if (isCorrect) correctCount++;
        totalTimeSpent += userAns.timeSpent || 0;

        return {
          index: idx + 1,
          id: q.id,
          question: q.q,
          code: q.code || null,
          options: q.options,
          correctAnswerIndex: q.answer,
          userAnswerIndex: userAns.selectedIndex,
          isCorrect,
          explanation: q.explanation,
          timeSpent: userAns.timeSpent
        };
      });

      const percentage = Math.round((correctCount / total) * 100);
      let rankTitle = "Apex Scholar ⚡";
      let rankDesc = "Flawless technical precision. Unbreakable standard.";
      if (percentage < 40) {
        rankTitle = "Novice Challenger 🌱";
        rankDesc = "Every master was once a beginner who refused to quit.";
      } else if (percentage < 70) {
        rankTitle = "Disciplined Coder ⚔️";
        rankDesc = "Solid foundation. Consistent execution will close the gap.";
      } else if (percentage < 90) {
        rankTitle = "Mastermind Architect 🧠";
        rankDesc = "Sharply tuned technical knowledge and deep understanding.";
      }

      return {
        topic: session.topic,
        topicTitle: session.topicTitle,
        topicIcon: session.topicIcon,
        level: session.level,
        score: correctCount,
        total,
        percentage,
        totalTimeSpent,
        rankTitle,
        rankDesc,
        review
      };
    }
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.DailyGrindQuiz = DailyGrindQuiz;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = DailyGrindQuiz;
  }
})();
