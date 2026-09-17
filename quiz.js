/**
 * Daily Grind Tracker — Skill Quiz Arena Engine
 * Topics: Data Science, Web Development, AI / ML
 * Tiers: Beginner, Intermediate, Advanced
 * 180 curated questions (20 per tier) with seeded PRNG and dynamic option shuffling.
 * 10 questions per quiz session with 120s (2 min) timer per question.
 * Luck-based trophy roll: 1 to 10 trophies (low ratio for 10).
 */

(function () {
  const QUIZ_BANK = {
  "datascience": {
    "title": "Data Science",
    "icon": "📊",
    "beginner": [
      {
        "id": "ds_b_1",
        "q": "What is the primary difference between `.loc` and `.iloc` in Pandas?",
        "code": "# Example Pandas DataFrame\nimport pandas as pd\ndf = pd.DataFrame({'val': [10, 20, 30]}, index=['a', 'b', 'c'])",
        "options": [
          ".loc is label-based indexing, while .iloc is integer position-based indexing.",
          ".iloc is label-based indexing, while .loc is integer position-based indexing.",
          ".loc modifies the DataFrame in-place, while .iloc creates a shallow copy.",
          "There is no difference; they are interchangeable aliases."
        ],
        "answer": 0,
        "explanation": ".loc selects rows and columns using explicit index/column labels, whereas .iloc selects using integer 0-indexed positions."
      },
      {
        "id": "ds_b_2",
        "q": "What will be the output of the following NumPy broadcasting operation?",
        "code": "import numpy as np\na = np.array([1, 2, 3])\nb = 2\nprint(a * b)",
        "options": [
          "[1, 2, 3, 1, 2, 3]",
          "[2, 4, 6]",
          "TypeError: Cannot multiply array by scalar",
          "[[2], [4], [6]]"
        ],
        "answer": 1,
        "explanation": "NumPy broadcasts the scalar 2 across all elements of array 'a', performing element-wise multiplication resulting in [2, 4, 6]."
      },
      {
        "id": "ds_b_3",
        "q": "Which metric is most resilient when describing the central tendency of a skewed dataset with extreme outliers?",
        "code": "salaries = [25000, 28000, 30000, 32000, 35000, 15000000]",
        "options": [
          "Mean (Arithmetic Average)",
          "Median (50th Percentile)",
          "Standard Deviation",
          "Variance"
        ],
        "answer": 1,
        "explanation": "The median represents the middle value of sorted data and is unaffected by extreme outliers, unlike the mean which gets heavily distorted."
      },
      {
        "id": "ds_b_4",
        "q": "What is the correct Pandas method to count total missing (NaN) values per column?",
        "code": "# Inspect missing data\ndf.____().sum()",
        "options": [
          "df.drop_duplicates()",
          "df.isna() or df.isnull()",
          "df.fillna()",
          "df.unique()"
        ],
        "answer": 1,
        "explanation": "df.isna() (or df.isnull()) returns a boolean mask of True for NaNs, and chaining .sum() sums True (as 1) for each column."
      },
      {
        "id": "ds_b_5",
        "q": "In SQL, what is the key difference between the WHERE clause and the HAVING clause?",
        "code": "SELECT department, AVG(salary) \nFROM employees \nWHERE age > 25 \nGROUP BY department \nHAVING AVG(salary) > 50000;",
        "options": [
          "WHERE filters rows before aggregation; HAVING filters aggregated groups.",
          "HAVING filters rows before aggregation; WHERE filters aggregated groups.",
          "WHERE works only on numeric columns; HAVING works on text columns.",
          "There is no difference; HAVING is just legacy SQL syntax."
        ],
        "answer": 0,
        "explanation": "WHERE filters individual table records prior to GROUP BY aggregation. HAVING filters grouped rows after aggregate functions (like AVG, SUM) have executed."
      },
      {
        "id": "ds_b_6",
        "q": "What type of chart is ideal for visualizing the continuous frequency distribution of a single numerical variable?",
        "code": "import matplotlib.pyplot as plt\n# Which plot visualizes distribution with binned intervals?",
        "options": [
          "Histogram",
          "Pie Chart",
          "Scatter Plot",
          "Radar Chart"
        ],
        "answer": 0,
        "explanation": "A histogram groups continuous numeric data into bins and plots the count/density of observations in each interval."
      },
      {
        "id": "ds_b_7",
        "q": "What does the `df.drop_duplicates(inplace=True)` statement do in Pandas?",
        "code": "import pandas as pd\ndf = pd.DataFrame({'id': [1, 2, 2, 3], 'item': ['A', 'B', 'B', 'C']})\ndf.drop_duplicates(inplace=True)",
        "options": [
          "Removes duplicate rows directly on 'df' without returning a new DataFrame.",
          "Creates a copy with duplicates removed and leaves 'df' unchanged.",
          "Deletes the first row of every duplicate group.",
          "Throws an error if any index label is repeated."
        ],
        "answer": 0,
        "explanation": "Setting inplace=True modifies the original DataFrame directly and returns None."
      },
      {
        "id": "ds_b_8",
        "q": "Why should you split data into Train and Test sets BEFORE performing feature scaling or imputation?",
        "code": "from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)",
        "options": [
          "To prevent Data Leakage from the test set into the training process.",
          "Because scikit-learn models crash if test sets are scaled.",
          "To make gradient descent converge faster on the CPU.",
          "It is optional and does not affect model performance."
        ],
        "answer": 0,
        "explanation": "Fitting scalers/imputers on the entire dataset leaks distribution parameters (mean, variance) of the test set into the training set, causing overly optimistic validation metrics."
      },
      {
        "id": "ds_b_9",
        "q": "What will `df['category'].astype('category')` achieve for low-cardinality string columns?",
        "code": "# High volume dataset with 1,000,000 rows\ndf['country'] = df['country'].astype('category')",
        "options": [
          "Substantially reduces memory footprint by storing integers mapped to unique strings.",
          "Encodes the column as binary one-hot vectors.",
          "Deletes all strings longer than 10 characters.",
          "Sorts the column in alphabetical order permanently."
        ],
        "answer": 0,
        "explanation": "Pandas categorical dtype stores distinct string values once in a dictionary and represents column values as compact integer codes, saving significant RAM."
      },
      {
        "id": "ds_b_10",
        "q": "In SQL, what kind of JOIN returns all records from Table A, and matching records from Table B (with NULLs for non-matches)?",
        "code": "SELECT A.user_id, B.order_id \nFROM Users A \n____ Orders B ON A.user_id = B.user_id;",
        "options": [
          "LEFT JOIN (or LEFT OUTER JOIN)",
          "INNER JOIN",
          "RIGHT JOIN",
          "CROSS JOIN"
        ],
        "answer": 0,
        "explanation": "LEFT JOIN preserves every row from the left table (Users) and fills missing matches from the right table (Orders) with NULL."
      },
      {
        "id": "ds_b_11",
        "q": "In Pandas, which parameter in `pd.read_csv()` is used to automatically convert specified columns into datetime objects?",
        "code": "df = pd.read_csv('orders.csv', parse_dates=['order_timestamp'])",
        "options": [
          "parse_dates",
          "datetime_cols",
          "convert_dates",
          "time_format"
        ],
        "answer": 0,
        "explanation": "The 'parse_dates' parameter instructs Pandas to parse specified column names or index lists into datetime64[ns] objects upon ingestion."
      },
      {
        "id": "ds_b_12",
        "q": "What is the key functional difference between `df.dropna()` and `df.fillna(0)`?",
        "code": "clean_df = df.dropna()\nimputed_df = df.fillna(0)",
        "options": [
          "df.dropna() eliminates rows/columns containing missing values, while df.fillna(0) replaces missing values with zero.",
          "df.dropna() replaces missing values with NaN, while df.fillna(0) removes rows.",
          "Both methods mutate the original DataFrame in-place by default.",
          "df.dropna() only operates on numeric columns, whereas df.fillna(0) works on strings."
        ],
        "answer": 0,
        "explanation": "dropna() removes rows/columns with null entries, whereas fillna() preserves the row count and imputes a substitute value."
      },
      {
        "id": "ds_b_13",
        "q": "In NumPy, how does `np.empty((3, 3))` differ from `np.zeros((3, 3))`?",
        "code": "arr1 = np.zeros((3, 3))\narr2 = np.empty((3, 3))",
        "options": [
          "np.empty allocates uninitialized memory containing whatever arbitrary garbage values already exist in RAM, making it slightly faster.",
          "np.empty initializes an array with NaN values.",
          "np.zeros allocates memory in CPU cache, while np.empty allocates on disk.",
          "There is no difference; both set all elements to 0."
        ],
        "answer": 0,
        "explanation": "np.empty allocates memory without zeroing it out, saving CPU cycles when the array will be overwritten immediately."
      },
      {
        "id": "ds_b_14",
        "q": "What does `arr.reshape(-1, 1)` accomplish when preparing feature vectors for scikit-learn estimators?",
        "code": "import numpy as np\nX = np.array([10, 20, 30, 40])\nX_reshaped = X.reshape(-1, 1)",
        "options": [
          "It transforms a 1D array of shape (N,) into a 2D column vector of shape (N, 1).",
          "It flattens a multi-dimensional matrix into a 1D list.",
          "It transposes rows into columns in-place.",
          "It removes negative values from the array."
        ],
        "answer": 0,
        "explanation": "Passing -1 tells NumPy to infer that dimension automatically. Reshaping to (-1, 1) converts a 1D sequence into a 2D feature matrix required by scikit-learn models."
      },
      {
        "id": "ds_b_15",
        "q": "In SQL, which aggregate query accurately calculates the count of unique customers who placed orders?",
        "code": "SELECT _______(customer_id) FROM orders;",
        "options": [
          "COUNT(DISTINCT customer_id)",
          "UNIQUE(customer_id)",
          "DISTINCT(COUNT customer_id)",
          "COUNT_UNIQUE(customer_id)"
        ],
        "answer": 0,
        "explanation": "COUNT(DISTINCT column_name) evaluates only unique, non-null entries in SQL aggregate grouping."
      },
      {
        "id": "ds_b_16",
        "q": "What does `df.groupby('category').agg({'sales': 'sum', 'units': 'mean'})` accomplish in Pandas?",
        "code": "summary = df.groupby('category').agg({'sales': 'sum', 'units': 'mean'})",
        "options": [
          "It applies multiple distinct aggregation functions across different specified columns for each grouped category.",
          "It sorts the dataframe by category and calculates correlation.",
          "It throws an error because .agg() only accepts a single function string.",
          "It merges two separate dataframes based on category."
        ],
        "answer": 0,
        "explanation": "Passing a dictionary mapping column names to aggregation strings inside .agg() enables multi-column heterogeneous aggregations in a single operation."
      },
      {
        "id": "ds_b_17",
        "q": "What is the mathematical bounded range of the Pearson Correlation Coefficient (r)?",
        "code": "r = cov(X, Y) / (std(X) * std(Y))",
        "options": [
          "Between -1.0 and +1.0",
          "Between 0.0 and +1.0",
          "Between -infinity and +infinity",
          "Between 0.0 and 100.0"
        ],
        "answer": 0,
        "explanation": "Pearson's correlation coefficient is strictly bounded between -1.0 (perfect negative linear correlation) and +1.0 (perfect positive linear correlation), where 0 signifies no linear correlation."
      },
      {
        "id": "ds_b_18",
        "q": "In Pandas, which method and argument returns the relative frequency (percentage proportions) of values in a Series?",
        "code": "proportions = df['status'].value_counts(normalize=True)",
        "options": [
          "value_counts(normalize=True)",
          "value_counts(percentage=True)",
          "frequency(relative=True)",
          "proportions()"
        ],
        "answer": 0,
        "explanation": "Setting 'normalize=True' in value_counts() divides raw counts by the total sum of frequencies, returning normalized relative proportions summing to 1.0."
      },
      {
        "id": "ds_b_19",
        "q": "In classical statistical hypothesis testing, what does a p-value less than 0.05 generally indicate?",
        "code": "if p_value < 0.05:\n    print('Reject null hypothesis')",
        "options": [
          "There is strong evidence against the null hypothesis, suggesting the observed effect is statistically significant assuming alpha = 0.05.",
          "The null hypothesis is 100% proven to be true.",
          "The probability that the alternative hypothesis is false is 5%.",
          "The dataset has a 95% margin of error."
        ],
        "answer": 0,
        "explanation": "A p-value < 0.05 indicates that, assuming the null hypothesis were true, the probability of observing data as extreme as what was measured is less than 5%, leading to rejection of the null hypothesis."
      },
      {
        "id": "ds_b_20",
        "q": "Which Seaborn visualization is standard for displaying a pairwise correlation matrix of numeric variables with color gradients?",
        "code": "import seaborn as sns\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')",
        "options": [
          "sns.heatmap()",
          "sns.pairplot()",
          "sns.scatterplot()",
          "sns.distgrid()"
        ],
        "answer": 0,
        "explanation": "sns.heatmap() renders 2D matrix data into a colored grid, ideal for correlation matrices with annotations and color maps."
      }
    ],
    "intermediate": [
      {
        "id": "ds_i_1",
        "q": "Which technique is most efficient for conditional column creation on a 10M row DataFrame?",
        "code": "# Option A: df['tier'] = df['score'].apply(lambda x: 'Pass' if x >= 70 else 'Fail')\n# Option B: df['tier'] = np.where(df['score'] >= 70, 'Pass', 'Fail')",
        "options": [
          "Option B (np.where) because it runs in compiled C vectorization without Python function overhead.",
          "Option A (df.apply) because lambda functions run parallelized by default.",
          "Both have identical performance since both are executed in Pandas.",
          "Iterating through the DataFrame with a for-loop and df.iloc."
        ],
        "answer": 0,
        "explanation": "np.where executes at C-speed in vectorized contiguous memory, easily 20x to 100x faster than df.apply which invokes Python bytecode per row."
      },
      {
        "id": "ds_i_2",
        "q": "According to NumPy broadcasting rules, will arrays with shapes (4, 1, 3) and (2, 3) broadcast together?",
        "code": "import numpy as np\nx = np.ones((4, 1, 3))\ny = np.ones((2, 3))\nz = x + y",
        "options": [
          "Yes, resulting in an array of shape (4, 2, 3).",
          "No, it throws ValueError: operands could not be broadcast together.",
          "Yes, resulting in an array of shape (4, 1, 3).",
          "Yes, but only if both arrays have dtype float64."
        ],
        "answer": 0,
        "explanation": "Aligning trailing dimensions: (4, 1, 3) and (1, 2, 3) -> dimension 1 and 2 match with 1 expanding to 2. The broadcast shape is (4, 2, 3)."
      },
      {
        "id": "ds_i_3",
        "q": "What is the difference between `RANK()` and `DENSE_RANK()` in SQL window functions?",
        "code": "SELECT student, score,\n       RANK() OVER (ORDER BY score DESC) as rnk,\n       DENSE_RANK() OVER (ORDER BY score DESC) as dense_rnk\nFROM exam;",
        "options": [
          "RANK leaves gaps in ranking after ties (e.g. 1, 2, 2, 4); DENSE_RANK leaves no gaps (e.g. 1, 2, 2, 3).",
          "DENSE_RANK leaves gaps in ranking after ties; RANK leaves no gaps.",
          "RANK works on text fields only; DENSE_RANK works on numeric fields only.",
          "RANK sorts in ascending order; DENSE_RANK sorts in descending order."
        ],
        "answer": 0,
        "explanation": "RANK skips subsequent ranks equal to the number of ties. DENSE_RANK assigns consecutive integers without any gaps."
      },
      {
        "id": "ds_i_4",
        "q": "When training a K-Nearest Neighbors (KNN) or SVM classifier, why is feature scaling mandatory, but optional for Decision Trees?",
        "code": "# Comparing scaling requirement\n# Model 1: KNN (Euclidean distance)\n# Model 2: XGBoost / Decision Tree",
        "options": [
          "KNN relies on geometric distance calculations where large-scale features dominate; tree models split along single orthogonal dimensions invariant to monotonic scale.",
          "Decision trees normalize features internally using batch norm.",
          "KNN handles categorical data natively, so scaling is needed for numbers.",
          "Scaling is mandatory for both; trees will error without StandardScaler."
        ],
        "answer": 0,
        "explanation": "Distance-based models (KNN, SVM, K-Means) compute Euclidean or Manhattan distance, so unscaled features with large ranges distort distance. Trees make threshold splits (x >= c) which are scale-invariant."
      },
      {
        "id": "ds_i_5",
        "q": "In an imbalanced dataset (99% Legitimate, 1% Fraud), which evaluation metric is LEAST informative?",
        "code": "# Fraud Detection Dataset\n# True Negatives: 990, False Positives: 0\n# False Negatives: 10, True Positives: 0",
        "options": [
          "Overall Accuracy",
          "Precision-Recall AUC (PR-AUC)",
          "F1-Score",
          "Recall on Fraud Class"
        ],
        "answer": 0,
        "explanation": "A naive model predicting 'Legitimate' for every transaction achieves 99% accuracy while detecting zero fraud cases. PR-AUC, Recall, and F1-score reveal the true performance."
      },
      {
        "id": "ds_i_6",
        "q": "What diagnostic tool is used to detect multicollinearity among independent regression variables?",
        "code": "# Checking collinearity between predictors\nfrom statsmodels.stats.outliers_influence import variance_inflation_factor",
        "options": [
          "Variance Inflation Factor (VIF)",
          "Durbin-Watson Statistic",
          "Silhouette Score",
          "Confusion Matrix"
        ],
        "answer": 0,
        "explanation": "VIF measures how much the variance of an estimated regression coefficient increases when predictors are correlated. VIF > 5 or 10 indicates severe multicollinearity."
      },
      {
        "id": "ds_i_7",
        "q": "What does `df.groupby('dept').agg(avg_sal=('salary', 'mean'), staff_count=('id', 'count'))` do in Pandas?",
        "code": "# Named aggregations in modern Pandas\nsummary = df.groupby('dept').agg(\n    avg_sal=('salary', 'mean'),\n    staff_count=('id', 'count')\n)",
        "options": [
          "Performs multiple column aggregations returning clean, non-hierarchical column names ('avg_sal' and 'staff_count').",
          "Throws a MultiIndex error because tuple arguments are invalid in .agg().",
          "Sorts the DataFrame by department without grouping.",
          "Calculates the global average salary across all departments."
        ],
        "answer": 0,
        "explanation": "Pandas named aggregation syntax assigns clean, single-level column names for specific aggregated columns without creating ugly MultiIndex columns."
      },
      {
        "id": "ds_i_8",
        "q": "What is the primary advantage of Stratified K-Fold cross-validation over standard K-Fold?",
        "code": "from sklearn.model_selection import StratifiedKFold\nskf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)",
        "options": [
          "Ensures each fold contains approximately the same percentage of target class labels as the complete dataset.",
          "Trains models 5x faster by skipping validation testing on odd folds.",
          "Prevents overfitting on continuous regression target variables.",
          "Automatically cleans outliers from the training partitions."
        ],
        "answer": 0,
        "explanation": "Stratified K-Fold preserves the class proportion in each fold, preventing scenarios where a fold accidentally lacks rare class samples in classification problems."
      },
      {
        "id": "ds_i_9",
        "q": "What is the difference between Pearson correlation and Spearman rank correlation?",
        "code": "# Comparing correlation types\nr_pearson = df.corr(method='pearson')\nr_spearman = df.corr(method='spearman')",
        "options": [
          "Pearson evaluates linear relationships; Spearman evaluates monotonic relationships using ranks.",
          "Pearson works only on categorical data; Spearman works on numeric data.",
          "Spearman can only return values between 0 and 1; Pearson returns -1 to +1.",
          "There is no difference; they yield identical values."
        ],
        "answer": 0,
        "explanation": "Pearson assumes normality and measures strict linear association. Spearman computes Pearson correlation on ranked values, detecting monotonic curves even when non-linear."
      },
      {
        "id": "ds_i_10",
        "q": "What will the SQL `COALESCE(bonus, commission, 0)` expression return for a row where `bonus` is NULL and `commission` is 250?",
        "code": "SELECT employee_id, COALESCE(bonus, commission, 0) AS total_extra\nFROM payroll;",
        "options": [
          "250",
          "NULL",
          "0",
          "SyntaxError"
        ],
        "answer": 0,
        "explanation": "COALESCE evaluates its arguments in sequence and returns the first non-NULL value encountered (in this case, commission = 250)."
      },
      {
        "id": "ds_i_11",
        "q": "What is the primary difference between `pd.merge()` and `df.join()` in Pandas?",
        "code": "df1.merge(df2, on='key', how='inner')\ndf1.join(df2, on='key', how='left')",
        "options": [
          "pd.merge() combines DataFrames based on any specified column or index keys, whereas df.join() joins predominantly on DataFrame indexes by default.",
          "df.join() performs cross-joins exclusively, while merge only performs inner joins.",
          "pd.merge() requires both DataFrames to have identical shapes.",
          "There is no difference; join is just a direct alias."
        ],
        "answer": 0,
        "explanation": "merge() offers maximum flexibility on arbitrary columns or index levels, whereas join() is a higher-level convenience function optimized for joining on indexes."
      },
      {
        "id": "ds_i_12",
        "q": "What does `pd.melt()` do to a wide-format DataFrame?",
        "code": "wide_df = pd.DataFrame({'Year': [2024], 'Q1': [100], 'Q2': [150]})\nlong_df = pd.melt(wide_df, id_vars=['Year'], var_name='Quarter', value_name='Revenue')",
        "options": [
          "It unpivots a DataFrame from wide format to long format, turning column headers into row values.",
          "It calculates rolling aggregations across time intervals.",
          "It deletes null values across horizontal row axes.",
          "It flattens multi-index column headers into strings."
        ],
        "answer": 0,
        "explanation": "pd.melt() transforms wide tables into long/tidy format by unpivoting measured columns into identifier variables and value columns."
      },
      {
        "id": "ds_i_13",
        "q": "Why are vectorized NumPy operations dramatically faster than applying a Python function via `df['col'].apply(func)`?",
        "code": "# Vectorized:\ndf['c'] = df['a'] + df['b']\n# Apply:\ndf['c'] = df.apply(lambda r: r['a'] + r['b'], axis=1)",
        "options": [
          "Vectorized operations execute compiled C code with SIMD instructions and contiguous memory loops, avoiding Python bytecode interpretation overhead on each row.",
          "Python apply() creates a separate OS process for every row.",
          "Vectorized operations use GPU execution automatically.",
          "apply() uses 64-bit precision while vectorization uses 8-bit precision."
        ],
        "answer": 0,
        "explanation": "Vectorization pushes execution down to compiled C loops with SIMD and cache locality, while .apply(..., axis=1) boxes each row as a Python Series and runs Python interpreter loops."
      },
      {
        "id": "ds_i_14",
        "q": "In SQL window functions, how does `DENSE_RANK()` differ from `RANK()` when identical values (ties) occur?",
        "code": "RANK() OVER (ORDER BY score DESC)\nDENSE_RANK() OVER (ORDER BY score DESC)",
        "options": [
          "RANK() skips subsequent rank numbers after ties (e.g., 1, 2, 2, 4), while DENSE_RANK() assigns consecutive rank numbers without gaps (e.g., 1, 2, 2, 3).",
          "DENSE_RANK() assigns unique random values, while RANK() always returns 1.",
          "RANK() operates only on partitions, while DENSE_RANK() cannot use PARTITION BY.",
          "DENSE_RANK() sorts in ascending order only."
        ],
        "answer": 0,
        "explanation": "RANK() leaves gaps in sequence corresponding to the number of tied rows, while DENSE_RANK() does not skip any ranks."
      },
      {
        "id": "ds_i_15",
        "q": "When using `OneHotEncoder(handle_unknown='ignore')` in scikit-learn, what happens if unseen categories appear during test/inference time?",
        "code": "encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)\nencoder.fit(X_train)",
        "options": [
          "The encoder transforms the unseen categories into all-zeros across the one-hot encoded feature vector without raising an exception.",
          "It raises a KeyError exception immediately.",
          "It assigns the unseen category to the most frequent training category.",
          "It replaces the entire row with NaNs."
        ],
        "answer": 0,
        "explanation": "Setting handle_unknown='ignore' safely encodes novel categories as all zeros in the one-hot columns, preventing pipeline crash during production scoring."
      },
      {
        "id": "ds_i_16",
        "q": "Why should `StratifiedKFold` be used instead of standard `KFold` cross-validation on imbalanced classification tasks?",
        "code": "from sklearn.model_selection import StratifiedKFold\nskf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)",
        "options": [
          "It ensures each split fold preserves approximately the same percentage proportion of target class labels as the complete dataset.",
          "It automatically oversamples minority classes using SMOTE.",
          "It trains faster by skipping 20% of the training samples.",
          "It prevents any data from being held out for validation."
        ],
        "answer": 0,
        "explanation": "StratifiedKFold stratifies splits so that every fold contains the same ratio of class labels, preventing folds with zero positive class samples in imbalanced datasets."
      },
      {
        "id": "ds_i_17",
        "q": "What diagnostic tool evaluates multicollinearity among independent variables in linear regression models?",
        "code": "from statsmodels.stats.outliers_influence import variance_inflation_factor",
        "options": [
          "Variance Inflation Factor (VIF), where values exceeding 5-10 indicate problematic multicollinearity.",
          "Durbin-Watson Test.",
          "Cook's Distance metric.",
          "Akaike Information Criterion (AIC)."
        ],
        "answer": 0,
        "explanation": "VIF measures how much the variance of an estimated regression coefficient increases when predictors are correlated. VIF > 5 or 10 signifies severe multicollinearity."
      },
      {
        "id": "ds_i_18",
        "q": "Why is Precision-Recall AUC (PR-AUC) preferred over ROC-AUC when evaluating fraud detection with a 0.01% positive fraud rate?",
        "code": "# Fraud Detection: 99.99% legitimate, 0.01% fraud",
        "options": [
          "ROC-AUC can present an overly optimistic assessment because the vast True Negative count keeps the False Positive Rate deceptively low, whereas PR-AUC focuses on the rare positive class.",
          "ROC-AUC cannot be calculated if class balance is not exactly 50/50.",
          "PR-AUC is mathematically bounded between -1 and +1.",
          "PR-AUC does not depend on model threshold."
        ],
        "answer": 0,
        "explanation": "In severe class imbalance, the huge true negative count dampens False Positive Rate in ROC curves. Precision-Recall curves directly evaluate the precision and recall of the rare positive class."
      },
      {
        "id": "ds_i_19",
        "q": "How can memory usage be reduced by up to 80-90% for high-cardinality repetitive string columns in Pandas?",
        "code": "df['country'] = df['country'].astype('category')",
        "options": [
          "Convert the column data type to 'category', storing repeated strings as integer codes mapped to a unique dictionary.",
          "Compress the column using zlib inside a lambda function.",
          "Convert strings to Python bytearrays.",
          "Cast strings to float16."
        ],
        "answer": 0,
        "explanation": "The 'category' dtype stores repetitive string values as compact integers pointing to an indexed dictionary of unique categories, drastically saving memory and accelerating groupby operations."
      },
      {
        "id": "ds_i_20",
        "q": "In SQL, what is the output of `COALESCE(col1, col2, 'Default')`?",
        "code": "SELECT COALESCE(phone, mobile, 'No Contact') FROM users;",
        "options": [
          "The first non-null expression from the evaluated list of arguments.",
          "Concatenation of all provided arguments into a single string.",
          "A boolean indicating whether any argument is null.",
          "The count of non-null values in the row."
        ],
        "answer": 0,
        "explanation": "COALESCE returns the first non-null value in its parameter list from left to right, providing fallback imputation."
      }
    ],
    "advanced": [
      {
        "id": "ds_a_1",
        "q": "In high-throughput Pandas pipelines, what is memory downcasting and why is it critical?",
        "code": "# Downcasting numeric types\npd.to_numeric(df['count'], downcast='integer')\npd.to_numeric(df['rate'], downcast='float')",
        "options": [
          "Converts default 64-bit integers and floats (int64/float64) into the smallest lossless types (int8/int16/float32), cutting RAM usage by 50-75%.",
          "Truncates decimal precision to zero places for integer safety.",
          "Transfers DataFrame memory from RAM to GPU VRAM.",
          "Deletes negative values from numeric series."
        ],
        "answer": 0,
        "explanation": "Python/Pandas defaults to 8-byte (64-bit) numeric types. Downcasting checks values and switches to int8 (1 byte), int16 (2 bytes), or float32, reducing memory footprints drastically."
      },
      {
        "id": "ds_a_2",
        "q": "What causes `numpy.ndarray.strides` to differ between C-contiguous and Fortran-contiguous arrays?",
        "code": "import numpy as np\na = np.zeros((3, 4), order='C')\nb = np.zeros((3, 4), order='F')\nprint(a.strides, b.strides)",
        "options": [
          "C-order stores row-major (consecutive row elements contiguous), while F-order stores column-major (consecutive column elements contiguous).",
          "C-order requires 64-bit pointers; F-order requires 32-bit pointers.",
          "C-order arrays are read-only views; F-order arrays are mutable buffers.",
          "F-order is only supported on Fortran-compiled CPUs."
        ],
        "answer": 0,
        "explanation": "In C-order (row-major), stepping to the next row skips 4*8=32 bytes; in F-order (column-major), stepping down a column is contiguous (8 bytes) and stepping across rows skips 3*8=24 bytes."
      },
      {
        "id": "ds_a_3",
        "q": "In the mathematical decomposition of Expected Prediction Error (MSE), what are the three core components?",
        "code": "E[(y - f_hat(x))^2] = ? + ? + ?",
        "options": [
          "Bias^2 + Variance + Irreducible Noise (sigma^2)",
          "Precision + Recall + Specificity",
          "Entropy + Gini Impurity + Residuals",
          "L1 Penalty + L2 Penalty + Learning Rate"
        ],
        "answer": 0,
        "explanation": "Mean Squared Error decomposes into squared model bias (underfitting), model variance (sensitivity to train fluctuations), and irreducible noise in the true data generating process."
      },
      {
        "id": "ds_a_4",
        "q": "In Principal Component Analysis (PCA), what do the Eigenvectors of the covariance matrix represent?",
        "code": "from sklearn.decomposition import PCA\npca = PCA(n_components=2)\npca.fit(X_scaled)",
        "options": [
          "The orthogonal directions (principal axes) of maximum variance in the feature space.",
          "The proportion of explained variance per feature.",
          "The cluster centroids of the observations.",
          "The p-values of feature significance."
        ],
        "answer": 0,
        "explanation": "Eigenvectors define the orthogonal directions along which the data varies most. The corresponding eigenvalues quantify the amount of variance captured along each axis."
      },
      {
        "id": "ds_a_5",
        "q": "Why is standard K-Fold cross-validation invalid for sequential Time Series forecasting?",
        "code": "# Time series model validation\n# Why is KFold(n_splits=5, shuffle=True) dangerous?",
        "options": [
          "It shuffles future observations into the training set, causing lookahead bias (data leakage from the future).",
          "Time series models can only be evaluated on single train-test splits.",
          "K-Fold fails because time series data cannot be converted to floats.",
          "Auto-regressive models do not allow cross-validation."
        ],
        "answer": 0,
        "explanation": "Shuffling time-series data allows future records to train past predictions. Walk-forward validation (TimeSeriesSplit) must be used to preserve temporal causality."
      },
      {
        "id": "ds_a_6",
        "q": "What is the computational complexity of the naive Exact K-Means clustering iteration with N points, K clusters, and D dimensions?",
        "code": "# K-Means convergence step: assigning N samples to K centroids in D-dim",
        "options": [
          "O(N * K * D)",
          "O(N^2 * D)",
          "O(K^3 * N)",
          "O(log(N) * K)"
        ],
        "answer": 0,
        "explanation": "In each iteration, distance must be calculated from each of the N points to each of the K centroids across all D feature dimensions, yielding O(N * K * D) operations."
      },
      {
        "id": "ds_a_7",
        "q": "What is Tree SHAP (SHapley Additive exPlanations) and why is it preferred over permutation feature importance?",
        "code": "import shap\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)",
        "options": [
          "It computes exact game-theoretic Shapley values in polynomial time for trees, providing consistent local feature contributions with additive efficiency.",
          "It only computes global importance by dropping columns one by one.",
          "It trains a secondary neural network to mimic the tree model.",
          "It requires synthetic noise injection to compute feature sensitivity."
        ],
        "answer": 0,
        "explanation": "Tree SHAP exploits tree structures to compute exact Shapley values in O(T * L * D^2) time, guaranteeing fairness axioms (local accuracy, missingness, consistency) across individual predictions."
      },
      {
        "id": "ds_a_8",
        "q": "What SQL construct is required to traverse an organization hierarchy (e.g. employee -> manager -> executive)?",
        "code": "WITH RECURSIVE OrgTree AS (\n  SELECT emp_id, manager_id, 1 as level FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.emp_id, e.manager_id, ot.level + 1\n  FROM employees e JOIN OrgTree ot ON e.manager_id = ot.emp_id\n)\nSELECT * FROM OrgTree;",
        "options": [
          "Recursive Common Table Expression (CTE)",
          "Window Aggregate with PARTITION BY",
          "CROSS APPLY with Subquery",
          "PIVOT Table statement"
        ],
        "answer": 0,
        "explanation": "Recursive CTEs contain an anchor query combined with a recursive query that repeatedly references the CTE until an empty set is returned, ideal for graphs and trees."
      },
      {
        "id": "ds_a_9",
        "q": "What is the primary benefit of Optuna (Bayesian Optimization via Tree-structured Parzen Estimators - TPE) over Grid Search?",
        "code": "import optuna\ndef objective(trial):\n    lr = trial.suggest_float(\"lr\", 1e-4, 1e-1, log=True)\n    ...",
        "options": [
          "It models the probability of objective function scores conditioned on past parameter trials, focusing search in high-performing regions.",
          "It tests every permutation deterministically across a linear grid.",
          "It eliminates the need for cross-validation on validation sets.",
          "It converts non-convex optimization problems into convex quadratic programs."
        ],
        "answer": 0,
        "explanation": "Bayesian optimization constructs a surrogate model of the objective function, balancing exploration and exploitation to converge on optimal hyperparameters with far fewer trials."
      },
      {
        "id": "ds_a_10",
        "q": "To build a robust production scikit-learn pipeline, what custom class must feature transformers inherit from?",
        "code": "from sklearn.base import BaseEstimator, TransformerMixin\n\nclass OutlierCapper(BaseEstimator, TransformerMixin):\n    def fit(self, X, y=None): return self\n    def transform(self, X): ...",
        "options": [
          "BaseEstimator and TransformerMixin",
          "nn.Module and ClassifierMixin",
          "DataFrame and Series",
          "ProcessPoolExecutor and Pipeline"
        ],
        "answer": 0,
        "explanation": "Inheriting from BaseEstimator provides get_params/set_params for hyperparameter tuning; TransformerMixin automatically provides fit_transform() from fit() and transform()."
      },
      {
        "id": "ds_a_11",
        "q": "In Apache Spark, what is the difference between a Transformation and an Action?",
        "code": "rdd2 = rdd1.filter(lambda x: x > 10) # Transformation\ncount = rdd2.count()                 # Action",
        "options": [
          "Transformations are lazily evaluated and build a Directed Acyclic Graph (DAG) of execution, while Actions trigger the actual computation and return results or write to storage.",
          "Transformations write data to disk, while Actions keep data in memory.",
          "Actions can only be executed on the driver node, while Transformations run on executors.",
          "Transformations mutate data in-place, while Actions return copies."
        ],
        "answer": 0,
        "explanation": "Spark transformations (map, filter) are lazy and define the lineage graph. Actions (count, collect, save) materialize the DAG and trigger distributed execution."
      },
      {
        "id": "ds_a_12",
        "q": "What database optimization occurs when an index contains all the columns requested by a SQL query?",
        "code": "CREATE INDEX idx_user ON orders(user_id, total_amount);\nSELECT user_id, total_amount FROM orders WHERE user_id = 42;",
        "options": [
          "Index-Only Scan (Covering Index), where the database reads data directly from the index tree without fetching rows from the table heap.",
          "Full Table Sequential Scan with multithreading.",
          "Dynamic Partition Pruning.",
          "Materialized View Expansion."
        ],
        "answer": 0,
        "explanation": "When an index covers all projected and filtered columns, an Index-Only Scan satisfies the query solely from the B-tree index, completely bypassing expensive table heap lookups."
      },
      {
        "id": "ds_a_13",
        "q": "Why does Apache Arrow provide significant acceleration in modern analytical data pipelines?",
        "code": "import pyarrow as pa\ntable = pa.Table.from_pandas(df)",
        "options": [
          "It provides a standardized, language-independent columnar memory format that enables zero-copy shared memory access across systems without serialization overhead.",
          "It automatically compiles Python code to CUDA kernels.",
          "It encrypts all in-memory data with hardware AES.",
          "It executes queries using quantum simulated annealing."
        ],
        "answer": 0,
        "explanation": "Arrow defines a standardized contiguous columnar in-memory layout, allowing Python, C++, Rust, and Spark to share memory buffers with zero serialization/deserialization cost."
      },
      {
        "id": "ds_a_14",
        "q": "How does Parquet file columnar storage achieve superior compression compared to row-based CSV or JSON?",
        "code": "# Parquet: Columnar chunking with dictionary and RLE encoding",
        "options": [
          "Data in each column has identical types and low entropy, allowing advanced compression like Run-Length Encoding (RLE) and dictionary encoding on individual column chunks.",
          "Parquet removes all column headers and replaces them with 1-byte hashes.",
          "Parquet compresses the entire filesystem using gzip block streaming.",
          "Parquet limits numeric precision to 8-bit integers."
        ],
        "answer": 0,
        "explanation": "Because values of the same type are stored contiguously in columns, similarity is high, enabling dictionary encoding, bit-packing, and RLE compression far exceeding row-oriented formats."
      },
      {
        "id": "ds_a_15",
        "q": "What phenomenon occurs when a statistical trend appears in several groups of data but disappears or reverses when the groups are combined?",
        "code": "# Group A: Treatment > Control\n# Group B: Treatment > Control\n# Combined: Control > Treatment",
        "options": [
          "Simpson's Paradox",
          "Berkson's Fallacy",
          "Gambler's Fallacy",
          "Survivorship Bias"
        ],
        "answer": 0,
        "explanation": "Simpson's Paradox happens when a confounding lurking variable disproportionately distributes across sub-groups, causing aggregate results to reverse the subgroup correlations."
      },
      {
        "id": "ds_a_16",
        "q": "In Bayesian A/B testing with binary conversion outcomes, what is the standard conjugate prior distribution paired with the Binomial likelihood?",
        "code": "prior = Beta(alpha=1, beta=1) # Uniform conjugate prior\nlikelihood = Binomial(n=1000, k=120)",
        "options": [
          "Beta Distribution, yielding an updated Beta posterior distribution in closed form.",
          "Gaussian (Normal) Distribution.",
          "Poisson Distribution.",
          "Gamma Distribution."
        ],
        "answer": 0,
        "explanation": "The Beta distribution is the conjugate prior for the Binomial distribution. The posterior is simply Beta(alpha + successes, beta + failures), requiring no expensive MCMC sampling."
      },
      {
        "id": "ds_a_17",
        "q": "How does an enterprise Feature Store (like Feast) solve 'Train-Serve Skew' in production machine learning?",
        "code": "# Feast: Point-in-time correct joins across entity dataframes",
        "options": [
          "By providing point-in-time correct historical feature joins for training and ultra-low latency key-value lookups for online inference from a unified feature definition.",
          "By automatically retraining models every 10 seconds.",
          "By encrypting training data using symmetric hashing.",
          "By serving predictions directly from Redis without models."
        ],
        "answer": 0,
        "explanation": "Feature stores prevent train-serve skew by synchronizing feature transformations between offline data lakes (historical point-in-time joins) and online stores (low-latency key-value serving)."
      },
      {
        "id": "ds_a_18",
        "q": "What is the primary risk of standard Target Encoding on high-cardinality categorical features, and how is it mitigated?",
        "code": "# Target Encoding: replacing category with target mean",
        "options": [
          "Target leakage leading to severe overfitting; mitigated by Out-Of-Fold (K-fold) target encoding and additive smoothing (empirical Bayes).",
          "Underfitting due to excessive variance shrinkage; mitigated by one-hot encoding.",
          "Numeric overflow; mitigated by float64 casting.",
          "Non-convergence of linear estimators; mitigated by L1 penalty."
        ],
        "answer": 0,
        "explanation": "Naive target encoding directly embeds label information into feature values causing extreme target leakage. K-fold out-of-fold encoding and smoothing with the global prior prevent this."
      },
      {
        "id": "ds_a_19",
        "q": "In Dask distributed computing, what happens if partition sizes are either too small (< 10MB) or too large (> 1GB)?",
        "code": "import dask.dataframe as dd\nddf = dd.read_parquet('data/*.parquet')",
        "options": [
          "Too small partitions cause overwhelming scheduler task-graph serialization overhead, while too large partitions trigger Out-Of-Memory (OOM) worker spills to disk.",
          "Dask automatically forces partition sizes to exactly 128MB regardless of configuration.",
          "Small partitions trigger GPU execution, large partitions trigger CPU.",
          "Partition size has zero impact on task runtime or memory usage."
        ],
        "answer": 0,
        "explanation": "Ideal Dask partition sizes are ~100MB-250MB. Sub-10MB chunks create millions of graph tasks overwhelming the scheduler; sub-1GB+ chunks exceed RAM limits and cause worker OOM death."
      },
      {
        "id": "ds_a_20",
        "q": "How does the Isolation Forest anomaly detection algorithm isolate outliers in multidimensional space?",
        "code": "from sklearn.ensemble import IsolationForest\niso = IsolationForest(n_estimators=100, contamination=0.01)",
        "options": [
          "Outliers require fewer random axis-aligned splits to isolate in recursive partitioning trees, resulting in noticeably shorter average path lengths from the root.",
          "It calculates Mahalanobis distance from the convex hull centroid.",
          "It clusters points using DBSCAN and measures epsilon density.",
          "It fits a Gaussian Mixture Model and flags points below 1% likelihood."
        ],
        "answer": 0,
        "explanation": "Anomalies are few and topologically distinct. Random binary tree splits isolate anomalies near the root (short tree depth), while normal clusters require much deeper partitions."
      }
    ]
  },
  "webdev": {
    "title": "Web Development",
    "icon": "🌐",
    "beginner": [
      {
        "id": "wd_b_1",
        "q": "What is the CSS Box Model composed of from inside to outside?",
        "code": "/* Standard CSS Box Model calculation */\n.box { box-sizing: content-box; }",
        "options": [
          "Content → Padding → Border → Margin",
          "Content → Margin → Border → Padding",
          "Padding → Content → Border → Margin",
          "Border → Padding → Content → Margin"
        ],
        "answer": 0,
        "explanation": "The CSS box model layers outwards: actual Content, surrounded by Padding, enclosed by the Border, and separated from neighbors by Margin."
      },
      {
        "id": "wd_b_2",
        "q": "What is the difference between `let` and `var` in modern JavaScript?",
        "code": "function test() {\n  if (true) {\n    var x = 1;\n    let y = 2;\n  }\n  console.log(x); // ?\n  console.log(y); // ?\n}",
        "options": [
          "`x` prints 1 because `var` is function-scoped; `y` throws ReferenceError because `let` is block-scoped.",
          "`y` prints 2 because `let` is function-scoped; `x` throws ReferenceError.",
          "Both print successfully because JavaScript scopes all variables globally.",
          "Both throw ReferenceError inside function bodies."
        ],
        "answer": 0,
        "explanation": "var is hoisted and scoped to the enclosing function. let and const are strictly scoped to the enclosing block ({ ... }), throwing ReferenceError if accessed outside."
      },
      {
        "id": "wd_b_3",
        "q": "What will the following strict equality comparison evaluate to?",
        "code": "console.log(0 == false);\nconsole.log(0 === false);",
        "options": [
          "true, followed by false",
          "false, followed by false",
          "true, followed by true",
          "TypeError"
        ],
        "answer": 0,
        "explanation": "Loose equality (==) coerces false to 0, evaluating to true. Strict equality (===) checks both value and type without coercion (number vs boolean), evaluating to false."
      },
      {
        "id": "wd_b_4",
        "q": "In Flexbox, which property aligns items along the main axis, and which aligns along the cross axis?",
        "code": ".container {\n  display: flex;\n  ____: center; /* Main axis */\n  ____: center; /* Cross axis */\n}",
        "options": [
          "justify-content for main axis; align-items for cross axis.",
          "align-items for main axis; justify-content for cross axis.",
          "flex-direction for main axis; flex-wrap for cross axis.",
          "align-content for main axis; justify-items for cross axis."
        ],
        "answer": 0,
        "explanation": "justify-content controls alignment along the main axis (horizontal by default), while align-items controls alignment across the perpendicular cross axis."
      },
      {
        "id": "wd_b_5",
        "q": "What does `event.preventDefault()` do when attached to a form submit event?",
        "code": "form.addEventListener('submit', (e) => {\n  e.preventDefault();\n  // ... custom JS logic\n});",
        "options": [
          "Stops the browser from executing its default full-page reload on form submission.",
          "Prevents the event from bubbling up to parent DOM elements.",
          "Clears all input values in the form automatically.",
          "Disables all submit buttons on the entire web page."
        ],
        "answer": 0,
        "explanation": "event.preventDefault() stops the default browser action (such as navigating to the form action URL and reloading the page), enabling client-side SPA handling."
      },
      {
        "id": "wd_b_6",
        "q": "Which array method creates a new array populated with the results of calling a function on every element?",
        "code": "const numbers = [1, 2, 3];\nconst doubled = numbers.____(n => n * 2); // [2, 4, 6]",
        "options": [
          "map()",
          "forEach()",
          "filter()",
          "reduce()"
        ],
        "answer": 0,
        "explanation": "map() transforms each element and returns a new array of identical length without mutating the original array."
      },
      {
        "id": "wd_b_7",
        "q": "What is the CSS specificity order from lowest to highest?",
        "code": "/* Specificity calculation */\n1. p { color: blue; }\n2. .card { color: red; }\n3. #main { color: green; }\n4. style=\"color: yellow\"",
        "options": [
          "Element (Type) < Class/Attribute < ID < Inline style",
          "Class < Element < Inline style < ID",
          "ID < Class < Element < Inline style",
          "Inline style < ID < Class < Element"
        ],
        "answer": 0,
        "explanation": "Standard CSS specificity weight: Universal (0) < Element (1) < Class/pseudo-class (10) < ID (100) < Inline style (1000) < !important."
      },
      {
        "id": "wd_b_8",
        "q": "What will `JSON.parse('{\"name\":\"Alex\",\"age\":24}')` produce in JavaScript?",
        "code": "const str = '{\"name\":\"Alex\",\"age\":24}';\nconst obj = JSON.parse(str);",
        "options": [
          "A JavaScript Object: { name: 'Alex', age: 24 }",
          "A plain string identical to input",
          "An array of strings: ['Alex', '24']",
          "A DOM Node object"
        ],
        "answer": 0,
        "explanation": "JSON.parse() deserializes a standard JSON formatted string into corresponding JavaScript native data structures."
      },
      {
        "id": "wd_b_9",
        "q": "Which semantic HTML5 element represents self-contained, independently distributable content (e.g. a blog post or news story)?",
        "code": "<!-- Semantic HTML5 architecture -->\n<____>\n  <h2>Breaking Tech News</h2>\n  <p>Article content goes here...</p>\n</____>",
        "options": [
          "<article>",
          "<section>",
          "<div>",
          "<aside>"
        ],
        "answer": 0,
        "explanation": "<article> denotes standalone reusable content that makes sense on its own. <section> represents a generic thematic grouping of content."
      },
      {
        "id": "wd_b_10",
        "q": "What will `typeof null` return in JavaScript?",
        "code": "console.log(typeof null);",
        "options": [
          "'object'",
          "'null'",
          "'undefined'",
          "'boolean'"
        ],
        "answer": 0,
        "explanation": "In JavaScript, typeof null returning 'object' is an infamous historical bug from the first 1995 JS engine (type tag for objects was 0, and null pointer was 0x00)."
      },
      {
        "id": "web_b_11",
        "q": "What is the semantic purpose of the HTML5 `<article>` element compared to `<section>`?",
        "code": "<article>\n  <h2>Breaking Tech News</h2>\n  <p>Article content here...</p>\n</article>",
        "options": [
          "`<article>` represents self-contained, independently distributable and reusable content (like a blog post or news story), while `<section>` represents a thematic grouping within content.",
          "`<article>` is only for newspaper websites.",
          "`<section>` can only be used inside the `<header>` element.",
          "There is no difference; they are generic block-level elements identical to `<div>`."
        ],
        "answer": 0,
        "explanation": "An `<article>` is intended to be completely standalone and syndicatable (e.g. RSS feeds), whereas `<section>` is a thematic grouping of content with a heading."
      },
      {
        "id": "web_b_12",
        "q": "What is the key advantage of applying `box-sizing: border-box` to all elements in CSS?",
        "code": "*, *::before, *::after {\n  box-sizing: border-box;\n}",
        "options": [
          "An element's specified width and height will include its content, padding, and border, preventing layout breaking when padding is added.",
          "It prevents any margin collapse between sibling elements.",
          "It forces all elements to render with a 1px solid border.",
          "It automatically centers block-level containers on screen."
        ],
        "answer": 0,
        "explanation": "With border-box, adding padding and borders does not inflate the computed width or height of the element, making layouts predictable."
      },
      {
        "id": "web_b_13",
        "q": "What does `typeof null` evaluate to in JavaScript, and why?",
        "code": "console.log(typeof null);",
        "options": [
          "\"object\" — an acknowledged legacy bug in the initial JavaScript implementation where the type tag for null was 0.",
          "\"null\" — because null is its own primitive type.",
          "\"undefined\" — because null denotes absence of value.",
          "\"boolean\" — because null coerces to false."
        ],
        "answer": 0,
        "explanation": "In the first JS implementation, values were stored with a type tag. Object type tag was 0, and the null pointer was also 0, causing typeof null to return 'object'."
      },
      {
        "id": "web_b_14",
        "q": "What is the primary operational difference between `==` and `===` in JavaScript?",
        "code": "0 == '0'  // evaluates to true\n0 === '0' // evaluates to false",
        "options": [
          "`==` performs type coercion before comparison, whereas `===` performs strict comparison without coercion, checking both value and type.",
          "`===` converts strings to numbers before checking.",
          "`==` checks memory references while `===` checks primitive values.",
          "`===` is only supported in modern ES6 modules."
        ],
        "answer": 0,
        "explanation": "Strict equality (===) checks that both operands have the same type and value without performing implicit type coercion."
      },
      {
        "id": "web_b_15",
        "q": "How does `Array.prototype.map()` differ from `Array.prototype.forEach()` in JavaScript?",
        "code": "const r1 = arr.map(x => x * 2);\nconst r2 = arr.forEach(x => x * 2);",
        "options": [
          "`map()` returns a new array with the transformed elements, while `forEach()` always returns `undefined` and is used for side effects.",
          "`forEach()` mutates the original array, while `map()` deletes it.",
          "`map()` is asynchronous while `forEach()` is synchronous.",
          "`forEach()` runs in reverse order."
        ],
        "answer": 0,
        "explanation": "map() constructs and returns a new array containing the results of calling the provided function on every element. forEach() returns undefined."
      },
      {
        "id": "web_b_16",
        "q": "What is the order of CSS specificity hierarchy from highest to lowest?",
        "code": "#header .nav-item a:hover",
        "options": [
          "Inline styles > ID selectors > Class / Attribute / Pseudo-class selectors > Element / Pseudo-element selectors",
          "Element selectors > Class selectors > ID selectors > Inline styles",
          "ID selectors > Inline styles > Class selectors > Element selectors",
          "Class selectors > ID selectors > Inline styles > Element selectors"
        ],
        "answer": 0,
        "explanation": "Specificity weight runs: Inline styles (1000) > ID (0100) > Class/Pseudo-class/Attribute (0010) > Elements/Pseudo-elements (0001)."
      },
      {
        "id": "web_b_17",
        "q": "In browser event handling, what is the difference between Event Bubbling and Event Capturing?",
        "code": "element.addEventListener('click', handler, { capture: true });",
        "options": [
          "Capturing travels down from Window to the target element (phase 1), while Bubbling bubbles up from target to Window (phase 3).",
          "Bubbling occurs only on form elements, capturing on links.",
          "Capturing executes asynchronously, bubbling executes synchronously.",
          "Bubbling prevents default browser behaviors."
        ],
        "answer": 0,
        "explanation": "Events trigger down from Window through ancestor nodes to the target (Capturing phase), and then bubble back up to Window (Bubbling phase)."
      },
      {
        "id": "web_b_18",
        "q": "How does browser `localStorage` differ from `sessionStorage`?",
        "code": "localStorage.setItem('theme', 'dark');\nsessionStorage.setItem('tempToken', 'xyz');",
        "options": [
          "localStorage persists indefinitely until cleared, while sessionStorage is wiped when the browser tab or session window is closed.",
          "sessionStorage has no storage capacity limit, while localStorage is limited to 1KB.",
          "localStorage data is automatically sent to the server in HTTP headers.",
          "sessionStorage is shared across different browser tabs of the same domain."
        ],
        "answer": 0,
        "explanation": "localStorage persists across browser restarts and tab sessions. sessionStorage data is scoped exclusively to the active browser tab and destroyed when closed."
      },
      {
        "id": "web_b_19",
        "q": "In CSS Flexbox, what is the role of `justify-content` versus `align-items`?",
        "code": ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
        "options": [
          "`justify-content` aligns items along the main axis (horizontal by default), while `align-items` aligns items along the cross axis (vertical by default).",
          "`justify-content` aligns text only, while `align-items` aligns images.",
          "`align-items` only works when flex-direction is column.",
          "They are synonymous properties."
        ],
        "answer": 0,
        "explanation": "justify-content governs layout along the main axis (dictated by flex-direction), whereas align-items governs positioning along the cross axis."
      },
      {
        "id": "web_b_20",
        "q": "Which HTTP status code signifies that a resource was successfully created on the server?",
        "code": "POST /api/tasks -> HTTP Status: ___",
        "options": [
          "201 Created",
          "200 OK",
          "204 No Content",
          "202 Accepted"
        ],
        "answer": 0,
        "explanation": "HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource, typically including a Location header."
      }
    ],
    "intermediate": [
      {
        "id": "wd_i_1",
        "q": "In the JavaScript Event Loop, in what exact order are these logs printed?",
        "code": "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
        "options": [
          "1, 4, 3, 2",
          "1, 2, 3, 4",
          "1, 4, 2, 3",
          "1, 3, 4, 2"
        ],
        "answer": 0,
        "explanation": "Synchronous code runs first ('1', '4'). Next, the microtask queue drains Promises ('3'). Finally, the macrotask queue executes setTimeout callbacks ('2')."
      },
      {
        "id": "wd_i_2",
        "q": "What will the following closure snippet output?",
        "code": "function createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\nconst c1 = createCounter();\nconst c2 = createCounter();\nconsole.log(c1(), c1(), c2());",
        "options": [
          "1 2 1",
          "1 1 1",
          "1 2 3",
          "ReferenceError: count is not defined"
        ],
        "answer": 0,
        "explanation": "Each invocation of createCounter() creates a distinct lexical environment. c1 maintains its own 'count' (1 then 2), while c2 has an isolated 'count' initialized to 1."
      },
      {
        "id": "wd_i_3",
        "q": "How does `Promise.all` differ from `Promise.allSettled` when one promise rejects?",
        "code": "const p1 = Promise.resolve('Success');\nconst p2 = Promise.reject(new Error('Failed'));\n// Comparing Promise.all([p1, p2]) vs Promise.allSettled([p1, p2])",
        "options": [
          "Promise.all immediately rejects with the first error; Promise.allSettled waits for all promises to finish and returns an array of status objects.",
          "Promise.allSettled rejects; Promise.all ignores errors and returns resolved values.",
          "Both reject immediately upon any error.",
          "Promise.all returns a boolean; Promise.allSettled returns values."
        ],
        "answer": 0,
        "explanation": "Promise.all employs short-circuit rejection. Promise.allSettled guarantees completion of every promise, returning { status: 'fulfilled'|'rejected', value|reason }."
      },
      {
        "id": "wd_i_4",
        "q": "What does the modern CSS Grid expression `repeat(auto-fit, minmax(250px, 1fr))` accomplish?",
        "code": ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n}",
        "options": [
          "Creates fully responsive columns that wrap without media queries, maintaining at least 250px and expanding equally to fill spare space.",
          "Fixes exactly 4 columns across all screens.",
          "Forces every row to have a height of 250px.",
          "Disables grid layout on mobile screens."
        ],
        "answer": 0,
        "explanation": "auto-fit fits as many 250px columns into the track as possible, and minmax(250px, 1fr) expands them to share remaining width, creating fluid responsive layouts."
      },
      {
        "id": "wd_i_5",
        "q": "What is the difference between debouncing and throttling a function?",
        "code": "// Window resize or search input handler\nconst handleSearch = debounce(searchApi, 300);\nconst handleScroll = throttle(updatePosition, 100);",
        "options": [
          "Debounce waits until events stop firing for X ms before executing; throttle ensures execution at most once every X ms interval.",
          "Throttle waits until events stop; debounce executes continuously.",
          "Debounce works on CSS; throttle works on JavaScript memory.",
          "There is no functional difference; they are aliases."
        ],
        "answer": 0,
        "explanation": "Debounce delays invocation until a period of inactivity passes (perfect for search inputs). Throttle enforces a maximum rate of calls over time (ideal for scroll listeners)."
      },
      {
        "id": "wd_i_6",
        "q": "Which HTTP response status code should a REST API return when a resource has been successfully created?",
        "code": "POST /api/tasks\nPayload: { \"title\": \"Review PR\" }\nResponse Status: ?",
        "options": [
          "201 Created",
          "200 OK",
          "204 No Content",
          "202 Accepted"
        ],
        "answer": 0,
        "explanation": "201 Created indicates successful request and resulting creation of one or more new resources, typically accompanied by a Location header."
      },
      {
        "id": "wd_i_7",
        "q": "How does `this` keyword resolve inside an arrow function compared to a standard function?",
        "code": "const obj = {\n  name: 'Tracker',\n  regular: function() { return this.name; },\n  arrow: () => this.name\n};",
        "options": [
          "Arrow functions do not bind their own `this`; they lexically inherit `this` from the surrounding enclosing scope.",
          "Arrow functions always bind `this` to the object containing them.",
          "Arrow functions bind `this` to undefined in strict mode.",
          "Regular functions can never access `this`."
        ],
        "answer": 0,
        "explanation": "Arrow functions do not have their own this context. They capture the this value of the enclosing lexical execution context at the time they are created."
      },
      {
        "id": "wd_i_8",
        "q": "Why should sensitive authentication tokens be stored in `HttpOnly` cookies rather than `localStorage`?",
        "code": "Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict",
        "options": [
          "HttpOnly cookies cannot be read or stolen by client-side JavaScript, protecting against Cross-Site Scripting (XSS) token theft.",
          "localStorage has a 5KB limit while cookies can store 50MB.",
          "localStorage is cleared every time the user closes the browser tab.",
          "Cookies encrypt the payload automatically using SHA-256."
        ],
        "answer": 0,
        "explanation": "If a web app suffers from an XSS vulnerability, malicious scripts can read localStorage.getItem('token'). HttpOnly cookies cannot be accessed by document.cookie or JS."
      },
      {
        "id": "wd_i_9",
        "q": "What causes a browser to send an HTTP `OPTIONS` preflight request before a fetch request?",
        "code": "fetch('https://api.example.com/data', {\n  method: 'PUT',\n  headers: { 'Content-Type': 'application/json' }\n});",
        "options": [
          "Cross-origin requests using methods other than GET/POST/HEAD, or custom headers like Content-Type: application/json.",
          "Whenever the request body exceeds 1 Kilobyte.",
          "Only when the browser is operating in Incognito / Private mode.",
          "Every single HTTPS request automatically sends an OPTIONS preflight."
        ],
        "answer": 0,
        "explanation": "Under CORS rules, any cross-origin request that is not a 'simple request' (e.g., using PUT/DELETE, or non-simple Content-Type like application/json) triggers an OPTIONS preflight check."
      },
      {
        "id": "wd_i_10",
        "q": "What does `AbortController` enable in modern JavaScript fetch requests?",
        "code": "const controller = new AbortController();\nfetch(url, { signal: controller.signal });\n// Later: controller.abort();",
        "options": [
          "Allows programmatic cancellation of pending HTTP network requests (e.g. on unmount or user timeout).",
          "Pauses the server-side database transaction.",
          "Reroutes the request through an HTTP proxy.",
          "Clears the browser HTTP disk cache."
        ],
        "answer": 0,
        "explanation": "AbortController creates an abort signal that can be passed to fetch(), cancelable via controller.abort(), which rejects the fetch promise with an AbortError."
      },
      {
        "id": "web_i_11",
        "q": "What is the fundamental difference between Debouncing and Throttling a JavaScript function?",
        "code": "const handleSearch = debounce(searchAPI, 300);\nconst handleScroll = throttle(updateScrollPosition, 100);",
        "options": [
          "Debouncing postpones execution until a specified delay has elapsed since the last event invocation; Throttling ensures the function runs at most once per fixed time interval.",
          "Debouncing runs on worker threads, while throttling runs on UI thread.",
          "Throttling cancels pending network calls, while debouncing caches them.",
          "They are identical patterns with different names."
        ],
        "answer": 0,
        "explanation": "Debounce groups bursts into a single execution after silence (e.g. search input). Throttle guarantees continuous execution at a capped maximum frequency (e.g. scroll/resize)."
      },
      {
        "id": "web_i_12",
        "q": "How does `Promise.allSettled()` differ from `Promise.all()`?",
        "code": "Promise.all([p1, p2, p3])\nPromise.allSettled([p1, p2, p3])",
        "options": [
          "`Promise.all()` rejects immediately upon the first rejected promise, while `Promise.allSettled()` waits for all promises to resolve or reject and returns an array of outcome objects.",
          "`Promise.allSettled()` terminates on the first success.",
          "`Promise.all()` runs sequentially, while `Promise.allSettled()` runs in parallel.",
          "`Promise.allSettled()` only works with fetch requests."
        ],
        "answer": 0,
        "explanation": "Promise.all fails-fast on the first rejection. Promise.allSettled waits for all promises to settle and returns an array of {status, value/reason} descriptors."
      },
      {
        "id": "web_i_13",
        "q": "What causes a memory leak when using JavaScript closures?",
        "code": "function setupListener() {\n  const hugeData = new Array(1000000).fill('leak');\n  return function() { console.log('active'); };\n}",
        "options": [
          "An inner function holding an uncollected reference to an outer lexical scope variable that is kept reachable in global or long-lived structures.",
          "Using arrow functions instead of regular functions.",
          "Declaring variables with const instead of let.",
          "Calling JSON.stringify on circular structures."
        ],
        "answer": 0,
        "explanation": "If a closure references an outer scope variable and that closure remains referenced (e.g. event listener, global timer), the entire lexical environment cannot be garbage collected."
      },
      {
        "id": "web_i_14",
        "q": "In Event Delegation, what is the difference between `event.target` and `event.currentTarget`?",
        "code": "document.getElementById('list').addEventListener('click', (e) => {\n  console.log(e.target, e.currentTarget);\n});",
        "options": [
          "`event.target` is the actual innermost element that triggered the event, while `event.currentTarget` is the element to which the event handler is attached.",
          "`event.currentTarget` is always the window object.",
          "`event.target` only exists during capturing phase.",
          "There is no difference; they always reference the same DOM node."
        ],
        "answer": 0,
        "explanation": "event.target refers to the element that was clicked (e.g. `<button>`), while event.currentTarget refers to the parent container listening to the event (e.g. `<ul>`)."
      },
      {
        "id": "web_i_15",
        "q": "What does the following CSS Grid rule produce?",
        "code": ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n}",
        "options": [
          "A fully responsive layout that automatically fits as many columns of at least 250px as possible, expanding remaining space equally across columns without media queries.",
          "A static 4-column grid fixed at 250px width.",
          "A grid with 250 rows and 1 column.",
          "A flexbox container that wraps elements."
        ],
        "answer": 0,
        "explanation": "auto-fit combined with minmax creates a self-responsive grid that dynamically adds or collapses columns based on container width without CSS media queries."
      },
      {
        "id": "web_i_16",
        "q": "What triggers a browser to send a CORS Preflight `OPTIONS` request before making an actual API call?",
        "code": "fetch('https://api.domain.com/data', {\n  headers: { 'Authorization': 'Bearer 123', 'Content-Type': 'application/json' }\n});",
        "options": [
          "Making a cross-origin request using non-simple HTTP methods (e.g. PUT, DELETE) or non-standard headers (e.g. Authorization, application/json).",
          "Any request containing query parameters.",
          "Requests made via HTTPS instead of HTTP.",
          "Any GET request to an external domain."
        ],
        "answer": 0,
        "explanation": "A CORS preflight OPTIONS request is dispatched whenever a request is not 'simple' (e.g., uses methods other than GET/POST/HEAD, or headers beyond standard safe headers like application/json or Authorization)."
      },
      {
        "id": "web_i_17",
        "q": "How does the Web Workers API prevent browser interface freezing during heavy computation?",
        "code": "const worker = new Worker('heavy-task.js');\nworker.postMessage({ data });",
        "options": [
          "It executes JavaScript code on an independent background thread isolated from the main browser UI thread.",
          "It accelerates JS code using the client's graphics card.",
          "It increases the priority of the browser process in the operating system.",
          "It caches the return value on the server."
        ],
        "answer": 0,
        "explanation": "Web Workers run scripts on background OS threads without access to the DOM, ensuring heavy calculations do not block the main UI thread's event loop."
      },
      {
        "id": "web_i_18",
        "q": "What major performance limitation of HTTP/1.1 does HTTP/2 multiplexing resolve?",
        "code": "# HTTP/2: Binary Framing Layer with Multiplexed Streams",
        "options": [
          "Head-of-Line (HoL) Blocking at the application layer, allowing multiple requests and responses to interleave concurrently over a single TCP connection.",
          "Eliminating the need for TLS/SSL certificates.",
          "Compressing images using lossy quantization on the wire.",
          "Allowing browsers to connect without IP addresses."
        ],
        "answer": 0,
        "explanation": "HTTP/1.1 can only send one request per TCP connection at a time (causing Head-of-Line blocking). HTTP/2 uses binary frames to multiplex hundreds of requests concurrently over a single connection."
      },
      {
        "id": "web_i_19",
        "q": "Why is the `IntersectionObserver` API preferred over `window.addEventListener('scroll', ...)` for lazy loading?",
        "code": "const observer = new IntersectionObserver(callback, options);\nobserver.observe(targetElement);",
        "options": [
          "It runs asynchronously off the main thread and does not cause continuous reflows or thrashing the main thread during high-frequency scrolling.",
          "It automatically compresses images before rendering them.",
          "It downloads assets using peer-to-peer WebRTC.",
          "It only works on SVG vector assets."
        ],
        "answer": 0,
        "explanation": "Scroll event listeners fire on the main thread and can trigger forced synchronous layout reflows. IntersectionObserver computes visibility asynchronously off the main thread."
      },
      {
        "id": "web_i_20",
        "q": "What are the three dot-separated components of a JSON Web Token (JWT)?",
        "code": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        "options": [
          "Header, Payload, and Signature",
          "Public Key, Private Key, and Salt",
          "Username, Password, and Expiry",
          "Client ID, Token ID, and Secret"
        ],
        "answer": 0,
        "explanation": "A JWT consists of Header (algorithm & token type), Payload (claims/user data), and Signature (cryptographic verification hash), all base64url encoded."
      }
    ],
    "advanced": [
      {
        "id": "wd_a_1",
        "q": "In browser rendering pipelines, what triggers a Layout (Reflow) versus a Repaint, and why is Reflow more expensive?",
        "code": "// Operation A: element.style.color = 'red';\n// Operation B: element.style.width = '200px';",
        "options": [
          "Width changes geometry/dimensions requiring recalculation of positions for the element and its descendants/ancestors (Reflow); color only modifies pixel appearance without geometric changes (Repaint).",
          "Repaints recalculate the DOM tree; Reflows only change colors.",
          "Both have identical GPU overhead on modern multi-core systems.",
          "Reflow executes entirely on the GPU; Repaint runs on the CPU."
        ],
        "answer": 0,
        "explanation": "Reflow (Layout) determines geometric dimensions and positioning of nodes in the document. Changing width/height/margin invalidates layout and cascades to other elements, whereas color changes only trigger Repaint."
      },
      {
        "id": "wd_a_2",
        "q": "What is 'Layout Thrashing' and how do you avoid it in high-frequency DOM manipulation?",
        "code": "// Anti-pattern:\nfor (let i = 0; i < items.length; i++) {\n  items[i].style.width = items[i].offsetWidth + 10 + 'px';\n}",
        "options": [
          "Interleaving DOM style writes with style reads forces the browser to synchronously recalculate layout on every loop iteration; batch reads first, then batch writes (e.g. via requestAnimationFrame).",
          "Loading too many CSS files asynchronously in the document head.",
          "Running CSS transitions without hardware acceleration.",
          "Using flexbox inside of an HTML table."
        ],
        "answer": 0,
        "explanation": "Reading geometry (like offsetWidth) immediately after modifying styles forces synchronous layout recalibration. Batching all reads together before performing writes avoids layout thrashing."
      },
      {
        "id": "wd_a_3",
        "q": "How does the `Content-Security-Policy` (CSP) header protect against Cross-Site Scripting (XSS)?",
        "code": "Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com; object-src 'none';",
        "options": [
          "Restricts the origins and sources from which scripts, styles, images, and other assets can be loaded and executed by the browser.",
          "Encrypts all outgoing form payloads with public-key cryptography.",
          "Blocks cross-origin cookies from being sent in HTTP requests.",
          "Disables the browser console for unauthenticated users."
        ],
        "answer": 0,
        "explanation": "CSP tells the browser which dynamic resources are trusted. By forbidding inline scripts ('unsafe-inline') and untrusted external domains, injected XSS scripts fail to execute."
      },
      {
        "id": "wd_a_4",
        "q": "In JavaScript memory management, how does Mark-and-Sweep garbage collection prevent memory leaks from circular references?",
        "code": "function setupCycle() {\n  const objA = {};\n  const objB = {};\n  objA.ref = objB;\n  objB.ref = objA;\n}",
        "options": [
          "It traverses references starting from the root objects (window/global); if a group of circularly referenced objects is unreachable from the roots, they are swept and freed.",
          "It counts incoming references and frees any object when its count hits zero.",
          "It automatically breaks circular references using WeakMaps.",
          "Circular references always leak memory in all modern JavaScript engines."
        ],
        "answer": 0,
        "explanation": "Reference-counting algorithms leaked on circular dependencies. Modern Mark-and-Sweep tracks reachability from Roots. If isolated circular structures are disconnected from roots, they are reclaimed."
      },
      {
        "id": "wd_a_5",
        "q": "What role does the `SameSite` cookie attribute play in preventing Cross-Site Request Forgery (CSRF)?",
        "code": "Set-Cookie: session_id=abc123; SameSite=Lax; Secure; HttpOnly",
        "options": [
          "Controls whether cookies are sent with cross-site requests, preventing malicious third-party sites from exploiting ambient credentials.",
          "Ensures cookies can only be accessed across subdomains of the same parent.",
          "Restricts cookie lifespan to exactly 15 minutes of idle time.",
          "Encrypts cookie content using server-side HMAC signatures."
        ],
        "answer": 0,
        "explanation": "SameSite=Strict prevents cookie inclusion on any cross-site request. SameSite=Lax (browser default) permits cookies only on top-level safe GET navigations, neutralizing standard CSRF attacks."
      },
      {
        "id": "wd_a_6",
        "q": "In Web Workers, why can you NOT directly access `document` or `window`?",
        "code": "// Inside worker.js\nconst worker = new Worker('worker.js');",
        "options": [
          "Web Workers run on separate background OS threads with isolated global scope (`self`) to avoid concurrency race conditions on the non-thread-safe DOM.",
          "Because browsers disable JavaScript inside background threads.",
          "Workers can only execute compiled WebAssembly code.",
          "Workers run inside an iframe with restricted sandboxing."
        ],
        "answer": 0,
        "explanation": "The DOM is not thread-safe. To prevent simultaneous multi-threaded mutations, Workers execute in an isolated environment without access to window or document, communicating via postMessage."
      },
      {
        "id": "wd_a_7",
        "q": "What is the difference between WebSockets and Server-Sent Events (SSE)?",
        "code": "// Option A: const ws = new WebSocket('wss://api.example.com/ws');\n// Option B: const sse = new EventSource('/api/events');",
        "options": [
          "WebSockets provide full-duplex bidirectional TCP communication; SSE provides lightweight, unidirectional streaming from server to client over standard HTTP with built-in reconnection.",
          "SSE is bidirectional; WebSockets are unidirectional only.",
          "WebSockets work only over HTTP/1.1; SSE requires HTTP/3.",
          "SSE requires opening a raw TCP socket on custom ports."
        ],
        "answer": 0,
        "explanation": "WebSockets upgrade the connection for full two-way communication. SSE uses plain HTTP streaming, automatic retry, and custom event names, ideal when only the server pushes real-time updates."
      },
      {
        "id": "wd_a_8",
        "q": "What will `Object.create(proto)` do compared to `Object.assign({}, proto)`?",
        "code": "const proto = { greet() { return 'Hi'; } };\nconst a = Object.create(proto);\nconst b = Object.assign({}, proto);",
        "options": [
          "`a` sets `proto` as the prototype in its prototype chain (`a.__proto__ === proto`); `b` copies enumerable own properties directly onto a new object.",
          "`b` sets the prototype; `a` creates a shallow copy.",
          "Both create identical objects with identical prototypes.",
          "`Object.create` freezes the object against future mutation."
        ],
        "answer": 0,
        "explanation": "Object.create(proto) creates an empty object whose hidden [[Prototype]] points to proto. Object.assign({}, proto) performs shallow property copy onto a new object whose prototype is Object.prototype."
      },
      {
        "id": "wd_a_9",
        "q": "In advanced TypeScript, what does the conditional mapped type `type NonNullable<T> = T extends null | undefined ? never : T` accomplish?",
        "code": "type Input = string | number | null | undefined;\ntype Cleaned = NonNullable<Input>; // ?",
        "options": [
          "Filters out `null` and `undefined` from union type `T`, leaving only `string | number`.",
          "Converts all null values to empty strings at runtime.",
          "Throws a compiler error whenever null is passed.",
          "Makes all properties of an interface optional."
        ],
        "answer": 0,
        "explanation": "By distributing over the union, members matching null or undefined resolve to 'never' (which collapses in unions), leaving only non-null primitives."
      },
      {
        "id": "wd_a_10",
        "q": "What is the purpose of Service Worker Cache Storage API strategies like 'Stale-While-Revalidate'?",
        "code": "self.addEventListener('fetch', (event) => {\n  // Stale-While-Revalidate pattern\n});",
        "options": [
          "Serves cached content immediately for instant load times, while simultaneously making a network request in the background to update the cache for next time.",
          "Always forces a fresh network download, deleting the cache on every visit.",
          "Caches assets only when the user is completely offline.",
          "Encrypts browser cookies into IndexedDB storage."
        ],
        "answer": 0,
        "explanation": "Stale-While-Revalidate delivers optimal performance: the client renders instantaneously using cached data, while background revalidation fetches fresh assets and updates the cache seamlessly."
      },
      {
        "id": "web_a_11",
        "q": "In the browser rendering engine, which CSS properties trigger GPU composition without causing expensive Layout (Reflow) or Paint?",
        "code": ".animated-card {\n  transform: translate3d(0, -10px, 0);\n  opacity: 0.95;\n}",
        "options": [
          "`transform` and `opacity`",
          "`width` and `height`",
          "`top` and `left`",
          "`margin` and `padding`"
        ],
        "answer": 0,
        "explanation": "transform and opacity can be handled entirely by the GPU compositor thread without forcing the browser to recalculate element geometry (Layout) or repaint pixels (Paint)."
      },
      {
        "id": "web_a_12",
        "q": "In progressive web app (PWA) Service Workers, how does the 'Stale-While-Revalidate' caching strategy operate?",
        "code": "self.addEventListener('fetch', (event) => {\n  // Stale-While-Revalidate pattern\n});",
        "options": [
          "It immediately serves the cached asset to the user for instant loading, while asynchronously fetching an updated version from the network to update the cache for future requests.",
          "It always waits for the network response before falling back to cache.",
          "It deletes all cached assets on every browser refresh.",
          "It stores data permanently in indexedDB without network checks."
        ],
        "answer": 0,
        "explanation": "Stale-While-Revalidate optimizes speed by serving cached data immediately (stale), while in the background fetching from the network to refresh the cache (revalidate)."
      },
      {
        "id": "web_a_13",
        "q": "How does V8 identify unreferenced memory during Garbage Collection via the Mark-and-Sweep algorithm?",
        "code": "// V8 Garbage Collector: Orinoco (Scavenger + Mark-Sweep-Compact)",
        "options": [
          "It traverses all active root references (global object, execution stack) and marks every reachable object. Any object remaining unmarked is identified as garbage and reclaimed.",
          "It counts how many times each variable is used in source code.",
          "It frees objects precisely when their reference count reaches zero in real time.",
          "It clears memory whenever CPU utilization exceeds 90%."
        ],
        "answer": 0,
        "explanation": "Mark-and-sweep starts from roots (window, call stack) and traverses all reference chains. Unreachable objects are swept and freed, solving cyclic reference problems."
      },
      {
        "id": "web_a_14",
        "q": "How does Server-Sent Events (SSE) differ from WebSockets?",
        "code": "const source = new EventSource('/api/events');\nsource.onmessage = (event) => { ... };",
        "options": [
          "SSE is unidirectional (server-to-client only) running over standard HTTP, with automatic reconnection and built-in event IDs, while WebSockets provide full-duplex bidirectional TCP communication.",
          "WebSockets can only transmit plain text, while SSE transmits binary buffers.",
          "SSE requires a custom binary network protocol.",
          "WebSockets cannot work behind corporate proxies or firewalls."
        ],
        "answer": 0,
        "explanation": "SSE provides lightweight, text-based unidirectional streaming from server to client over regular HTTP, featuring native reconnection. WebSockets provide full bidirectional channels over a custom protocol."
      },
      {
        "id": "web_a_15",
        "q": "In Content Security Policy (CSP), what is the security benefit of a Cryptographic Nonce (`script-src 'nonce-...'`) over `'unsafe-inline'`?",
        "code": "Content-Security-Policy: script-src 'nonce-rAnd0m123' 'strict-dynamic';",
        "options": [
          "Only inline scripts carrying the exact one-time cryptographic nonce generated per-request by the server will execute, completely blocking Cross-Site Scripting (XSS) script injection.",
          "It encrypts JavaScript code so users cannot inspect it.",
          "It disables the browser console in production.",
          "It accelerates script parsing by 40%."
        ],
        "answer": 0,
        "explanation": "An attacker injecting `<script>` tags via XSS will not possess the unique cryptographically random nonce generated for that HTTP response, causing the browser to reject execution."
      },
      {
        "id": "web_a_16",
        "q": "What is the core architectural innovation of React Fiber?",
        "code": "// React 16+ Reconciliation Engine: Fiber",
        "options": [
          "It reimplements the virtual DOM reconciler into interruptible units of work with cooperative multitasking, allowing high-priority user input to pause low-priority rendering.",
          "It compiles JSX directly into WebAssembly machine code.",
          "It eliminates the virtual DOM entirely in favor of direct DOM mutations.",
          "It connects React components directly to GraphQL backends."
        ],
        "answer": 0,
        "explanation": "Fiber replaces synchronous recursive tree diffing with a linked-list work-loop that can pause, prioritize, and resume work without locking up the browser main thread."
      },
      {
        "id": "web_a_17",
        "q": "What transport protocol does HTTP/3 operate over, and what critical issue does it solve?",
        "code": "# HTTP/3: QUIC protocol over UDP",
        "options": [
          "It operates over QUIC (UDP), eliminating TCP-level Head-of-Line blocking when packet loss occurs on a single stream.",
          "It operates over ICMP to bypass cloud firewalls.",
          "It replaces IP routing with blockchain hashing.",
          "It uses WebSocket transport to eliminate HTTP headers."
        ],
        "answer": 0,
        "explanation": "In HTTP/2, a lost TCP packet stalls all multiplexed streams until retransmitted. HTTP/3 runs over QUIC (UDP), so packet loss on one stream does not block unrelated concurrent streams."
      },
      {
        "id": "web_a_18",
        "q": "How does the `SameSite=Lax` cookie attribute protect web applications against Cross-Site Request Forgery (CSRF)?",
        "code": "Set-Cookie: session_id=abc123xyz; Secure; HttpOnly; SameSite=Lax",
        "options": [
          "Cookies are withheld on cross-site subrequests (e.g. unauthorized image/POST form submissions from external sites) while allowing cookies on top-level cross-site navigations (e.g. following a link).",
          "Cookies are only transmitted if the client IP matches the server IP.",
          "Cookies are deleted automatically after 60 seconds of inactivity.",
          "It encrypts cookie payloads with the user's password."
        ],
        "answer": 0,
        "explanation": "SameSite=Lax prevents third-party sites from executing CSRF attacks via forged POST forms or AJAX, because session cookies are blocked on cross-site write requests."
      },
      {
        "id": "web_a_19",
        "q": "What does Module Federation in modern build systems (Webpack 5 / Vite) enable?",
        "code": "# ModuleFederationPlugin: remotes and shared dependencies",
        "options": [
          "Multiple independently deployed frontend applications can dynamically share modules and shared vendor libraries at runtime without bundling them into a monolithic build.",
          "It compiles JavaScript directly into serverless AWS Lambda functions.",
          "It bundles all npm packages into a single binary executable.",
          "It automatically translates JavaScript code into TypeScript."
        ],
        "answer": 0,
        "explanation": "Module Federation allows independent microfrontends to dynamically load remote code and share single instances of common libraries (like React) at runtime without build-time coupling."
      },
      {
        "id": "web_a_20",
        "q": "In Web Vitals optimization, what is the impact of adding `<link rel=\"preload\" as=\"image\" href=\"hero.webp\" fetchpriority=\"high\">`?",
        "code": "<link rel=\"preload\" as=\"image\" href=\"hero.webp\" fetchpriority=\"high\">",
        "options": [
          "It instructs the browser to discover and download the critical Largest Contentful Paint (LCP) hero image immediately before HTML parsing encounters the `<img>` tag.",
          "It caches the image on local disk for 10 years.",
          "It converts the image into WebP format on the fly.",
          "It disables responsive image sizing on mobile devices."
        ],
        "answer": 0,
        "explanation": "Preloading the LCP element with high fetchpriority triggers network fetching at the very start of the page lifecycle, drastically slashing LCP load delay times."
      }
    ]
  },
  "aiml": {
    "title": "AI / Machine Learning",
    "icon": "🤖",
    "beginner": [
      {
        "id": "ai_b_1",
        "q": "What is the primary difference between Supervised and Unsupervised learning?",
        "code": "# Paradigm comparison:\nDataset A: Feature matrix X with ground truth labels y\nDataset B: Feature matrix X with no labels",
        "options": [
          "Supervised learning trains on labeled data (input-output pairs); Unsupervised learning discovers hidden patterns in unlabeled data.",
          "Supervised learning uses neural networks; Unsupervised learning uses only linear regression.",
          "Unsupervised learning requires human supervision during training.",
          "There is no difference; both require ground-truth targets."
        ],
        "answer": 0,
        "explanation": "Supervised learning maps inputs to known target labels (classification/regression). Unsupervised learning identifies inherent clustering or dimensionality structure without target labels."
      },
      {
        "id": "ai_b_2",
        "q": "What problem occurs when a model achieves 99% accuracy on training data but only 55% accuracy on test data?",
        "code": "Train Loss: 0.02 | Train Acc: 99.4%\nTest Loss:  1.85 | Test Acc:  55.1%",
        "options": [
          "Overfitting (High Variance)",
          "Underfitting (High Bias)",
          "Data Leakage",
          "Gradient Vanishing"
        ],
        "answer": 0,
        "explanation": "Overfitting occurs when a model memorizes noise and specific details of the training set rather than learning generalizable patterns, causing poor performance on unseen data."
      },
      {
        "id": "ai_b_3",
        "q": "Why are non-linear activation functions (like ReLU or GELU) essential in deep neural networks?",
        "code": "# Neural Network Layer Composition\nz = W2 * (W1 * x + b1) + b2",
        "options": [
          "Without non-linearity, stacking multiple layers collapses mathematically into a single linear transformation (W2*W1 = W_equiv).",
          "They prevent the weights from becoming negative numbers.",
          "They eliminate the need for backpropagation.",
          "They convert all floating-point numbers into 8-bit integers."
        ],
        "answer": 0,
        "explanation": "A linear combination of linear functions is still just a linear function. Non-linear activations allow neural networks to approximate complex non-linear functions (Universal Approximation Theorem)."
      },
      {
        "id": "ai_b_4",
        "q": "In Gradient Descent, what happens if the learning rate (alpha) is set excessively high?",
        "code": "theta = theta - alpha * gradient_cost",
        "options": [
          "The optimization can overshoot the minimum, oscillate wildly, or diverge to infinity (NaN loss).",
          "The model takes millions of iterations to make any progress.",
          "The weights are automatically set to zero.",
          "It guarantees finding the global minimum in 1 step."
        ],
        "answer": 0,
        "explanation": "An excessively large learning rate takes oversized steps, missing the minimum, bouncing back and forth across valleys, and causing the loss to diverge."
      },
      {
        "id": "ai_b_5",
        "q": "What metric is defined as True Positives / (True Positives + False Positives)?",
        "code": "TP = 80, FP = 20, FN = 10, TN = 890\nMetric = 80 / (80 + 20) = 0.80",
        "options": [
          "Precision",
          "Recall (Sensitivity)",
          "Specificity",
          "F1-Score"
        ],
        "answer": 0,
        "explanation": "Precision measures how many of the positively predicted instances were actually correct (focusing on minimizing false alarms)."
      },
      {
        "id": "ai_b_6",
        "q": "In K-Means clustering, what is the 'Elbow Method' used for?",
        "code": "inertias = []\nfor k in range(1, 11):\n    kmeans = KMeans(n_clusters=k).fit(X)\n    inertias.append(kmeans.inertia_)\n# Plotting inertias vs k to find the bend",
        "options": [
          "Determining the optimal number of clusters (K) where within-cluster sum of squares (inertia) elbow bend appears.",
          "Detecting corrupted training samples.",
          "Calculating the optimal learning rate for neural networks.",
          "Measuring classification accuracy on test sets."
        ],
        "answer": 0,
        "explanation": "The elbow curve plots inertia vs number of clusters k. The point where the rate of decrease sharply shifts (the elbow) suggests optimal cluster count."
      },
      {
        "id": "ai_b_7",
        "q": "What is the primary loss function used for training binary classification models?",
        "code": "L = - (y * log(p) + (1 - y) * log(1 - p))",
        "options": [
          "Binary Cross-Entropy (Log Loss)",
          "Mean Squared Error (MSE)",
          "Mean Absolute Error (MAE)",
          "Hinge Loss"
        ],
        "answer": 0,
        "explanation": "Binary Cross-Entropy penalizes confident wrong probability predictions heavily and matches the negative log-likelihood of Bernoulli distribution."
      },
      {
        "id": "ai_b_8",
        "q": "What does the `Dropout` layer do during neural network training?",
        "code": "import torch.nn as nn\nmodel = nn.Sequential(\n    nn.Linear(128, 64),\n    nn.ReLU(),\n    nn.Dropout(p=0.5)\n)",
        "options": [
          "Randomly zeroes out a fraction 'p' of neuron activations during training to prevent co-adaptation and reduce overfitting.",
          "Deletes 50% of the training dataset randomly.",
          "Halves the learning rate after every epoch.",
          "Removes dead neurons permanently from the model file."
        ],
        "answer": 0,
        "explanation": "Dropout acts as an ensemble of thinned networks by randomly turning off units during training, forcing individual neurons to learn robust features without relying on specific co-activations."
      },
      {
        "id": "ai_b_9",
        "q": "What is the purpose of the validation set in a Train-Validation-Test workflow?",
        "code": "# Dataset Split\n# 70% Train, 15% Validation, 15% Test",
        "options": [
          "To tune hyperparameters and make early-stopping decisions without touching the final test set.",
          "To train model parameters via backpropagation.",
          "To replace the training set when data is small.",
          "To store predictions for production deployment."
        ],
        "answer": 0,
        "explanation": "The validation set provides an unbiased evaluation during model tuning and model selection. The test set is reserved exclusively for final confirmation of generalization."
      },
      {
        "id": "ai_b_10",
        "q": "What is a major advantage of Random Forests over a single Decision Tree?",
        "code": "from sklearn.ensemble import RandomForestClassifier\nrf = RandomForestClassifier(n_estimators=100)",
        "options": [
          "Aggregating predictions across multiple de-correlated trees drastically reduces variance without increasing bias.",
          "Random Forests train faster than a single shallow tree.",
          "Random Forests never require any memory to store.",
          "Random Forests can only predict continuous linear targets."
        ],
        "answer": 0,
        "explanation": "Single decision trees suffer from high variance (overfitting). Random forest bagging (bootstrap aggregation with random feature subsets) smooths out variance through averaging."
      },
      {
        "id": "ai_b_11",
        "q": "What is the foundational difference between Supervised and Unsupervised learning?",
        "code": "# Paradigm 1: (X, y)\n# Paradigm 2: (X)",
        "options": [
          "Supervised learning trains on labeled data with known ground-truth targets; Unsupervised learning discovers hidden patterns or clusters in unlabeled data without target guidance.",
          "Supervised learning runs on GPUs, while unsupervised learning runs on CPUs.",
          "Unsupervised learning is only used for image classification.",
          "Supervised learning never requires training epochs."
        ],
        "answer": 0,
        "explanation": "Supervised models learn a mapping function from input features to target labels (y). Unsupervised models infer intrinsic clustering or distribution patterns from inputs alone."
      },
      {
        "id": "ai_b_12",
        "q": "In machine learning model diagnostics, what characterizes an 'overfitted' model?",
        "code": "# Train Accuracy: 99.8%\n# Validation Accuracy: 64.1%",
        "options": [
          "High training accuracy but poor validation/test accuracy (High Variance), caused by memorizing training noise rather than learning generalizable patterns.",
          "Low training accuracy and low validation accuracy (High Bias).",
          "Equal performance on all datasets.",
          "The model converges in a single training epoch."
        ],
        "answer": 0,
        "explanation": "Overfitting occurs when a model fits training noise and complex idiosyncrasies, leading to stellar training performance but poor generalization on unseen validation data."
      },
      {
        "id": "ai_b_13",
        "q": "Why is a dataset partitioned into Train, Validation, and Test sets rather than just Train and Test?",
        "code": "X_train, X_val, X_test",
        "options": [
          "The validation set is used for tuning hyperparameters and early stopping, keeping the test set completely pristine for unbiased final performance evaluation.",
          "The validation set is used to double the size of training data.",
          "The test set is used to compute gradients during backpropagation.",
          "Splitting into three sets is required by scikit-learn syntax."
        ],
        "answer": 0,
        "explanation": "If hyperparameters are tuned on the test set, information leaks and evaluation becomes biased. The validation set guides tuning, leaving the test set untouched for honest final reporting."
      },
      {
        "id": "ai_b_14",
        "q": "In a binary classification confusion matrix, what is a False Positive (Type I Error)?",
        "code": "# Prediction: Positive (1)\n# Actual Ground Truth: Negative (0)",
        "options": [
          "The model incorrectly predicts a positive outcome when the true actual label is negative.",
          "The model incorrectly predicts a negative outcome when the true actual label is positive.",
          "The model correctly identifies a positive instance.",
          "The model encounters a missing value during prediction."
        ],
        "answer": 0,
        "explanation": "A False Positive occurs when the model alarms or predicts positive, but the reality is negative (e.g. flagging a benign email as spam)."
      },
      {
        "id": "ai_b_15",
        "q": "What is the mathematical definition of Precision in binary classification?",
        "code": "Precision = ___ / (___ + FP)",
        "options": [
          "True Positives / (True Positives + False Positives)",
          "True Positives / (True Positives + False Negatives)",
          "(True Positives + True Negatives) / Total Samples",
          "True Negatives / (True Negatives + False Positives)"
        ],
        "answer": 0,
        "explanation": "Precision measures of all samples predicted as positive, what proportion was actually positive: TP / (TP + FP)."
      },
      {
        "id": "ai_b_16",
        "q": "In the K-Nearest Neighbors (KNN) algorithm, what risk is associated with setting K to 1?",
        "code": "from sklearn.neighbors import KNeighborsClassifier\nknn = KNeighborsClassifier(n_neighbors=1)",
        "options": [
          "The decision boundary becomes extremely jagged and sensitive to training data noise, causing high variance and overfitting.",
          "The model underfits and predicts only the majority class.",
          "The algorithm fails to compute Euclidean distance.",
          "Training time increases by a factor of 1000."
        ],
        "answer": 0,
        "explanation": "K=1 memorizes training data. Every noisy outlier creates its own decision boundary island, leading to severe overfitting."
      },
      {
        "id": "ai_b_17",
        "q": "What metric is commonly minimized when deciding node splits in Classification Decision Trees?",
        "code": "Gini = 1 - sum(p_i^2)",
        "options": [
          "Gini Impurity or Entropy (Information Gain)",
          "Mean Squared Error (MSE)",
          "Cosine Similarity",
          "L1 Weight Norm"
        ],
        "answer": 0,
        "explanation": "Classification trees evaluate splits that maximize the drop in node impurity, measured via Gini Impurity or Shannon Entropy."
      },
      {
        "id": "ai_b_18",
        "q": "What happens in Gradient Descent if the learning rate is set too large?",
        "code": "theta = theta - learning_rate * gradient # if learning_rate = 1e3",
        "options": [
          "The parameter updates can overshoot the minimum, oscillate wildly, and cause the loss function to diverge to infinity or NaN.",
          "Training takes millions of iterations to make noticeable progress.",
          "The model gets trapped in the nearest local minimum immediately.",
          "Gradients automatically clip to zero."
        ],
        "answer": 0,
        "explanation": "An excessively large learning rate takes oversized parameter steps that overshoot the loss valley, causing numerical instability and divergence."
      },
      {
        "id": "ai_b_19",
        "q": "What distinguishes an Epoch from an Iteration in neural network training?",
        "code": "dataset_size = 10000, batch_size = 100",
        "options": [
          "An Epoch is one complete forward and backward pass of the entire dataset; an Iteration is the completion of a single batch pass.",
          "An Epoch refers to a single batch pass, while an iteration is the full dataset.",
          "Epochs apply to CNNs, while iterations apply only to RNNs.",
          "They are synonymous terms."
        ],
        "answer": 0,
        "explanation": "1 Epoch = 1 pass over all training examples. 1 Iteration = 1 step updating weights on 1 mini-batch (10,000 samples / 100 batch size = 100 iterations per epoch)."
      },
      {
        "id": "ai_b_20",
        "q": "Why did the Rectified Linear Unit (ReLU) activation function largely replace Sigmoid in hidden layers of deep networks?",
        "code": "f(x) = max(0, x)",
        "options": [
          "Its derivative is 1 for all positive inputs, preventing the vanishing gradient problem during backpropagation while being computationally cheap to evaluate.",
          "It maps all outputs strictly between 0 and 1.",
          "It prevents dead neurons from ever forming.",
          "It makes models robust to negative inputs by inverting them."
        ],
        "answer": 0,
        "explanation": "Sigmoid saturates at 0 and 1 where gradients approach 0 (vanishing gradients). ReLU has constant gradient of 1 for positive activations, allowing effective gradient flow across deep architectures."
      }
    ],
    "intermediate": [
      {
        "id": "ai_i_1",
        "q": "What is the fundamental difference between L1 (Lasso) and L2 (Ridge) weight regularization?",
        "code": "# Regularization terms:\n# L1: lambda * sum(|w_i|)\n# L2: lambda * sum(w_i^2)",
        "options": [
          "L1 encourages sparse weights by driving non-critical coefficients to absolute zero (feature selection); L2 shrinks weights close to zero without zeroing them out completely.",
          "L2 produces sparse weights; L1 keeps all features non-zero.",
          "L1 can only be applied to classification; L2 only to regression.",
          "L2 eliminates the need for gradient descent."
        ],
        "answer": 0,
        "explanation": "L1 penalty has sharp corners on the coordinate axes (diamond constraint), driving coefficients to exact zeros (sparse solutions). L2 penalty has spherical contours, decaying weights smoothly."
      },
      {
        "id": "ai_i_2",
        "q": "What is the purpose of Residual Connections (Skip Connections) introduced in ResNet?",
        "code": "y = F(x, {W_i}) + x",
        "options": [
          "They allow gradients to propagate directly through the identity shortcut, mitigating the vanishing gradient problem in very deep networks.",
          "They reduce the number of weights in the network by half.",
          "They replace convolutional layers with linear projections.",
          "They force the network to become recurrent."
        ],
        "answer": 0,
        "explanation": "In deep networks, backpropagated gradients shrink exponentially. Skip connections provide an uninterrupted gradient highway back to early layers, enabling training of networks with 100+ layers."
      },
      {
        "id": "ai_i_3",
        "q": "How does the Adam optimizer combine the concepts of Momentum and RMSProp?",
        "code": "# Adam updates:\n# m_t = beta1 * m_{t-1} + (1 - beta1) * g_t (First moment)\n# v_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2 (Second moment)",
        "options": [
          "It computes exponentially decaying averages of past gradients (momentum) and past squared gradients (adaptive learning rate scaling).",
          "It uses genetic algorithms alongside gradient descent.",
          "It switches between L1 and L2 regularization every batch.",
          "It computes second-order Hessian matrices directly."
        ],
        "answer": 0,
        "explanation": "Adam tracks the exponentially decaying average of past gradients (momentum - 1st moment) to accelerate in consistent directions and past squared gradients (RMSProp - 2nd moment) to scale individual coordinate learning rates."
      },
      {
        "id": "ai_i_4",
        "q": "In Convolutional Neural Networks (CNNs), what is the receptive field of a neuron?",
        "code": "layer1 = Conv2d(in=3, out=64, kernel=3)\nlayer2 = Conv2d(in=64, out=128, kernel=3)",
        "options": [
          "The specific region of the input image that directly influences the activation of that neuron.",
          "The total number of floating-point parameters in that layer.",
          "The memory size allocated for GPU tensor buffers.",
          "The learning rate assigned to that filter."
        ],
        "answer": 0,
        "explanation": "The receptive field is the sensory patch in the original input image that contributes to a particular unit's feature representation. Stacking conv layers expands the receptive field hierarchically."
      },
      {
        "id": "ai_i_5",
        "q": "Why do traditional Recurrent Neural Networks (RNNs) struggle with long-term dependencies compared to LSTMs?",
        "code": "h_t = tanh(W_hh * h_{t-1} + W_xh * x_t)",
        "options": [
          "Repeated matrix multiplication across long time steps causes gradients to either vanish to 0 or explode to infinity; LSTMs regulate flow via additive cell state gates.",
          "RNNs cannot process sequential data longer than 10 words.",
          "RNNs require unsupervised training only.",
          "LSTMs do not use backpropagation."
        ],
        "answer": 0,
        "explanation": "Standard RNNs multiply by the same weight matrix across time steps, causing exponential gradient decay/explosion. LSTMs maintain a constant error carousel via forget, input, and output gates."
      },
      {
        "id": "ai_i_6",
        "q": "What is the role of the Softmax function in multi-class classification output layers?",
        "code": "softmax(z_i) = exp(z_i) / sum(exp(z_j))",
        "options": [
          "Converts raw unnormalized model logits into a valid probability distribution that sums to 1.",
          "Eliminates negative weights from the final linear projection.",
          "Computes the classification accuracy directly.",
          "Binarizes predictions into 0 or 1."
        ],
        "answer": 0,
        "explanation": "Softmax exponentiates raw logits (ensuring non-negative values) and normalizes by the sum of all exponentials, producing probabilities summing strictly to 1.0."
      },
      {
        "id": "ai_i_7",
        "q": "In Word Embeddings (like Word2Vec), how are semantic relationships captured mathematically?",
        "code": "# Vector arithmetic:\nvec(\"King\") - vec(\"Man\") + vec(\"Woman\") ≈ vec(\"Queen\")",
        "options": [
          "Words appearing in similar contextual distributions map to nearby vectors in high-dimensional continuous geometric space, preserving linear semantic offsets.",
          "Words are converted to integer alphabetical order.",
          "Every word is represented as an orthogonal one-hot vector.",
          "By hashing words into a 32-bit integer array."
        ],
        "answer": 0,
        "explanation": "Word2Vec embeds words such that dot products reflect co-occurrence frequency. Semantic relationships (gender, tense, capital cities) emerge as consistent vector displacement directions."
      },
      {
        "id": "ai_i_8",
        "q": "What is Transfer Learning and why is it standard practice in Computer Vision and NLP?",
        "code": "from torchvision.models import resnet50, ResNet50_Weights\nmodel = resnet50(weights=ResNet50_Weights.DEFAULT)\nmodel.fc = nn.Linear(2048, num_custom_classes)",
        "options": [
          "Using feature representations learned on massive datasets (e.g. ImageNet) and fine-tuning on custom tasks, saving compute and excelling with small datasets.",
          "Transferring trained models from Python to C++ automatically.",
          "Compressing neural networks onto microcontroller chips.",
          "Training a model without any target loss function."
        ],
        "answer": 0,
        "explanation": "Pre-trained models already understand low-level and mid-level generic features (edges, shapes, grammar). Reusing these foundational weights allows high accuracy with minimal custom labeled data."
      },
      {
        "id": "ai_i_9",
        "q": "What is Focal Loss designed to address in dense object detection (like RetinaNet)?",
        "code": "FL(p_t) = - alpha_t * (1 - p_t)^gamma * log(p_t)",
        "options": [
          "Extreme foreground-background class imbalance by down-weighting the loss contribution from easy, well-classified background examples.",
          "Overfitting on small image resolutions.",
          "Slow inference speed on mobile devices.",
          "Color jitter distortions in data augmentation."
        ],
        "answer": 0,
        "explanation": "In object detection, millions of candidate anchor boxes are trivial background. Focal Loss applies a modulating factor (1 - p_t)^gamma to focus training on hard, ambiguous foreground examples."
      },
      {
        "id": "ai_i_10",
        "q": "What is the difference between Batch Normalization and Layer Normalization?",
        "code": "# Normalization axes:\n# Batch Normalization: computes statistics across batch dimension\n# Layer Normalization: computes statistics across feature/channel dimension",
        "options": [
          "BatchNorm normalizes across batch samples for each feature independently; LayerNorm normalizes across all features for each individual sample independently.",
          "LayerNorm works only on CNNs; BatchNorm works only on Transformers.",
          "BatchNorm has no learnable parameters; LayerNorm has learnable parameters.",
          "There is no difference; they are mathematically identical."
        ],
        "answer": 0,
        "explanation": "BatchNorm computes mean and variance across the batch, making it sensitive to batch size and unsuited for varying-length sequences. LayerNorm normalizes across the feature dimension per sample, ideal for Transformers and RNNs."
      },
      {
        "id": "ai_i_11",
        "q": "How does L1 (Lasso) regularization differ from L2 (Ridge) regularization regarding feature selection?",
        "code": "Loss_L1 = Loss + lambda * sum(|w_i|)\nLoss_L2 = Loss + lambda * sum(w_i^2)",
        "options": [
          "L1 regularization drives irrelevant feature weights to exactly zero, producing sparse models that perform feature selection; L2 shrinks weights toward zero without forcing them to absolute zero.",
          "L2 produces sparse models, while L1 produces dense models.",
          "L1 only works on decision trees, while L2 only works on neural networks.",
          "L2 regularization prevents underfitting, while L1 prevents convergence."
        ],
        "answer": 0,
        "explanation": "Due to the sharp diamond geometry of L1 diamond constraints in parameter space, optimal solutions frequently intersect at corners on axes where weights equal 0, yielding sparse feature selection."
      },
      {
        "id": "ai_i_12",
        "q": "In Convolutional Neural Networks (CNNs), what is the difference between 'Same' padding and 'Valid' padding?",
        "code": "Conv2D(filters=32, kernel_size=(3, 3), padding='same')",
        "options": [
          "'Same' padding adds zero-padding around borders so output spatial dimensions match input dimensions; 'Valid' padding adds no padding, causing spatial dimensions to shrink.",
          "'Valid' padding pads with the mean value, while 'Same' pads with zeros.",
          "'Same' padding doubles image resolution.",
          "'Valid' padding is only used during testing."
        ],
        "answer": 0,
        "explanation": "Valid padding performs convolution only where the kernel fits completely inside the image boundary (shrinking the output). Same padding pads borders so spatial height and width are preserved."
      },
      {
        "id": "ai_i_13",
        "q": "What is the primary role of Max Pooling layers in computer vision architectures?",
        "code": "MaxPool2D(pool_size=(2, 2), strides=2)",
        "options": [
          "Downsampling spatial resolution to reduce computational parameters and memory while granting translation invariance to small spatial shifts.",
          "Normalizing pixel brightness across color channels.",
          "Preventing weights from vanishing during backward pass.",
          "Linearly increasing the number of feature channels."
        ],
        "answer": 0,
        "explanation": "Max pooling extracts the dominant feature in each window, cutting spatial dimensions in half, curbing parameter explosion, and providing spatial translational invariance."
      },
      {
        "id": "ai_i_14",
        "q": "In Long Short-Term Memory (LSTM) networks, what is the role of the Forget Gate?",
        "code": "f_t = sigmoid(W_f * [h_{t-1}, x_t] + b_f)",
        "options": [
          "It outputs values between 0 and 1 to determine what proportion of information from the previous cell state should be discarded or retained.",
          "It resets model weights to random initializations after every epoch.",
          "It deletes the final output token from prediction.",
          "It converts recurrent hidden states into attention weights."
        ],
        "answer": 0,
        "explanation": "The forget gate applies a sigmoid function to the previous hidden state and current input. A value of 0 means completely forget, while 1 means completely retain the cell state."
      },
      {
        "id": "ai_i_15",
        "q": "In word embeddings, what is the core architectural difference between Word2Vec CBOW and Skip-Gram?",
        "code": "# Model 1: Context words -> Target word\n# Model 2: Target word -> Context words",
        "options": [
          "CBOW predicts the target center word from surrounding context words; Skip-Gram predicts the surrounding context words given a target center word.",
          "CBOW is unsupervised, while Skip-Gram requires human labelers.",
          "Skip-Gram only works on character n-grams.",
          "CBOW produces 1D vectors, while Skip-Gram produces 3D tensors."
        ],
        "answer": 0,
        "explanation": "Continuous Bag-of-Words (CBOW) aggregates surrounding context words to predict the missing center word. Skip-Gram uses the center word to predict surrounding words, performing better on rare words."
      },
      {
        "id": "ai_i_16",
        "q": "In Transformer Self-Attention, why is the dot product of Query and Key scaled by `1 / sqrt(d_k)`?",
        "code": "Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V",
        "options": [
          "For large dimension d_k, dot products grow large in magnitude, pushing the softmax function into regions with vanishingly small gradients; dividing by sqrt(d_k) stabilizes gradients.",
          "It enforces that attention scores sum to 100%.",
          "It converts the attention matrix into an orthogonal projection.",
          "It allows the model to attend to future tokens during training."
        ],
        "answer": 0,
        "explanation": "As d_k increases, variance of dot products grows as d_k. Unscaled values produce extreme logits, causing softmax to saturate into flat regions with near-zero gradients. Scaling maintains unit variance."
      },
      {
        "id": "ai_i_17",
        "q": "How does Dropout behave differently during training versus inference (evaluation) time?",
        "code": "model.train() # Dropout active\nmodel.eval()  # Dropout disabled",
        "options": [
          "During training, random neurons are zeroed out with probability p and remaining activations are scaled by 1/(1-p); during inference, dropout is disabled and all neurons remain active.",
          "Dropout is active in both modes, but uses different random seeds.",
          "During inference, dropout drops 100% of weights to save memory.",
          "Dropout only drops bias terms during inference."
        ],
        "answer": 0,
        "explanation": "Inverted dropout randomly masks activations during training to break co-adaptation. During inference, all neurons are kept active with no dropout so deterministic predictions are made."
      },
      {
        "id": "ai_i_18",
        "q": "How does the Adam optimizer combine the strengths of Momentum and RMSProp?",
        "code": "m_t = beta1 * m_{t-1} + (1 - beta1) * g_t      # 1st moment (momentum)\nv_t = beta2 * v_{t-1} + (1 - beta2) * g_t^2    # 2nd moment (RMSProp)",
        "options": [
          "It computes exponentially decaying averages of past gradients (momentum) as well as past squared gradients (adaptive learning rates per parameter).",
          "It switches between L1 and L2 regularization dynamically.",
          "It alternates between CPU and GPU computing.",
          "It evaluates the Hessian matrix of second derivatives."
        ],
        "answer": 0,
        "explanation": "Adam calculates first moments (moving average of gradients for velocity/momentum) and second moments (moving average of squared gradients for adaptive coordinate scaling)."
      },
      {
        "id": "ai_i_19",
        "q": "In Transfer Learning, what is the standard protocol when fine-tuning a pre-trained backbone model on a small novel dataset?",
        "code": "for param in base_model.parameters():\n    param.requires_grad = False\n# Train only new classifier head",
        "options": [
          "Freeze the pre-trained feature extractor backbone weights and train only the newly attached classification head, optionally unfreezing top layers later with a low learning rate.",
          "Reinitialize all backbone weights with random values and train from scratch.",
          "Delete all normalization layers and train with batch size 1.",
          "Train only on samples where the pre-trained model made errors."
        ],
        "answer": 0,
        "explanation": "Freezing pre-trained backbone layers prevents catastrophic forgetting of general features. Only the classification head is trained on the small dataset, followed by gentle fine-tuning."
      },
      {
        "id": "ai_i_20",
        "q": "Why is Cross-Entropy loss preferred over Mean Squared Error (MSE) for multi-class classification with Softmax outputs?",
        "code": "Loss = -sum(y_true * log(y_pred))",
        "options": [
          "MSE combined with Softmax suffers from severe gradient vanishing when predictions are confidently wrong, while Cross-Entropy produces steep, linear gradients that strongly penalize wrong predictions.",
          "MSE cannot be evaluated on floating-point numbers.",
          "Cross-Entropy guarantees 100% test accuracy.",
          "Cross-Entropy requires no backward pass calculation."
        ],
        "answer": 0,
        "explanation": "The derivative of cross-entropy with respect to softmax logits is simply (y_pred - y_true). MSE on softmax produces vanishing gradients for confidently incorrect predictions."
      }
    ],
    "advanced": [
      {
        "id": "ai_a_1",
        "q": "What is the exact Scaled Dot-Product Attention formula in the original Transformer architecture?",
        "code": "Attention(Q, K, V) = ?",
        "options": [
          "Softmax((Q * K^T) / sqrt(d_k)) * V",
          "Sigmoid(Q * K^T) * V",
          "Softmax(Q * V^T) * K",
          "(Q * K^T) / d_k + V"
        ],
        "answer": 0,
        "explanation": "Attention multiplies query and key matrices, scales by 1/sqrt(d_k) to prevent dot products from growing excessively large (which would push softmax into small gradient regions), applies softmax, and weights values V."
      },
      {
        "id": "ai_a_2",
        "q": "Why does Multi-Head Attention project Queries, Keys, and Values into 'h' lower-dimensional subspaces?",
        "code": "MultiHead(Q, K, V) = Concat(head_1, ..., head_h) * W_O\nwhere head_i = Attention(Q * W_i^Q, K * W_i^K, V * W_i^V)",
        "options": [
          "It allows the model to jointly attend to information from different representation subspaces and distinct positions simultaneously.",
          "It reduces the parameter count of the Transformer to near zero.",
          "It eliminates the need for feed-forward layers in the transformer block.",
          "It prevents backpropagation from computing matrix derivatives."
        ],
        "answer": 0,
        "explanation": "Single-head attention averages across all features. Multi-head attention allows individual heads to specialize in different linguistic patterns (e.g. subject-verb agreement, syntactic references, positional proximity)."
      },
      {
        "id": "ai_a_3",
        "q": "How does Rotary Position Embedding (RoPE) inject positional awareness compared to absolute sinusoidal embeddings?",
        "code": "# RoPE in LLaMA / modern LLMs:\nq_m = R_theta,m * (W_q * x_m)",
        "options": [
          "It rotates the query and key vectors in 2D coordinate pairs by angles proportional to their position index, naturally decaying inner product as relative distance increases.",
          "It concatenates a one-hot position vector to the token embedding.",
          "It adds a learned bias vector to the final logits.",
          "It sorts tokens chronologically in the GPU cache."
        ],
        "answer": 0,
        "explanation": "RoPE applies complex orthogonal rotation matrices to 2D chunks of query and key vectors. The inner product <R_m q, R_n k> depends solely on relative offset (m - n), enabling superior context generalization."
      },
      {
        "id": "ai_a_4",
        "q": "In Parameter-Efficient Fine-Tuning (PEFT), how does LoRA (Low-Rank Adaptation) freeze base weights while training?",
        "code": "W_updated = W_0 + (B * A) * (alpha / r)\nwhere W_0 is (d x k) frozen, B is (d x r), A is (r x k), r << d",
        "options": [
          "It decomposes the weight update matrix delta-W into two low-rank matrices B and A (with rank r), drastically reducing trainable parameters by 99% while freezing base W_0.",
          "It quantizes all 16-bit floating point weights into 1-bit binary weights.",
          "It prunes 90% of the attention heads permanently.",
          "It adds extra layers at the very end of the network."
        ],
        "answer": 0,
        "explanation": "Weight updates have a low intrinsic dimension. By representing delta-W as B * A where rank r is small (e.g. r=8 or 16), LoRA trains minimal parameters without latency overhead (B*A can be folded back into W_0 at inference)."
      },
      {
        "id": "ai_a_5",
        "q": "What is the KV Cache in LLM autoregressive token generation and why is it critical for throughput?",
        "code": "next_token = model(current_token, past_key_values=kv_cache)",
        "options": [
          "It stores the computed Key and Value matrices of all previous tokens, avoiding redundant re-computation of past attention representations on every generated token.",
          "It caches the entire vocabulary in CPU RAM.",
          "It prevents hallucination by validating grammar rules.",
          "It stores the optimizer states during forward inference."
        ],
        "answer": 0,
        "explanation": "Generating token N only requires calculating Key and Value for token N. Caching past K and V matrices drops single-token generation complexity from O(N^2) to O(N) per step."
      },
      {
        "id": "ai_a_6",
        "q": "What is the key difference between RLHF with PPO and DPO (Direct Preference Optimization)?",
        "code": "# DPO Loss formulation\nL_DPO = - E[log(sigmoid(beta * log(pi(y_w|x)/ref(y_w|x)) - beta * log(pi(y_l|x)/ref(y_l|x))))]",
        "options": [
          "DPO derives an analytical closed-form solution that optimizes the policy directly on preference pairs, eliminating the need to train a separate reward model or use complex PPO reinforcement learning loops.",
          "PPO requires no human preference data; DPO requires millions of examples.",
          "DPO works only on visual models; PPO works on text only.",
          "DPO requires online exploration during inference."
        ],
        "answer": 0,
        "explanation": "Rafailov et al. showed that the objective under the Bradley-Terry preference model can be optimized directly on the policy network, removing the instability of training separate reward models and actor-critic PPO loops."
      },
      {
        "id": "ai_a_7",
        "q": "What distinguishes NormalFloat4 (NF4) quantization used in QLoRA from standard uniform 4-bit integer quantization (INT4)?",
        "code": "# QLoRA NF4 quantization scheme",
        "options": [
          "NF4 builds an information-theoretically optimal quantile grid assuming zero-mean normal distribution of weights, ensuring equal number of parameters in each quantization bin.",
          "NF4 rounds all weights to the nearest whole integer between 0 and 15.",
          "NF4 converts weights to 4-bit strings of ASCII characters.",
          "NF4 is a lossless compression algorithm based on Huffman coding."
        ],
        "answer": 0,
        "explanation": "Neural network weights follow a normal distribution. NF4 constructs quantile intervals with equal probability mass under standard Gaussian N(0, 1), minimizing quantization distortion compared to linear INT4."
      },
      {
        "id": "ai_a_8",
        "q": "What does FlashAttention achieve at the hardware level to accelerate attention computations?",
        "code": "# Tri Dao's FlashAttention breakthrough",
        "options": [
          "Uses tiling and online softmax to compute attention block-by-block within fast GPU SRAM, avoiding slow reads/writes of N x N attention matrices to High Bandwidth Memory (HBM).",
          "Approximates attention using low-rank random Fourier features.",
          "Transfers attention computation from GPU to CPU cache.",
          "Drops 50% of the attention connections in the upper layers."
        ],
        "answer": 0,
        "explanation": "Standard attention is memory-bandwidth bound (reading/writing large intermediate N x N matrices to GPU HBM). FlashAttention fuses operations and computes online softmax in fast on-chip SRAM, yielding 2-4x speedups."
      },
      {
        "id": "ai_a_9",
        "q": "Why has RMSNorm largely replaced LayerNorm in state-of-the-art LLMs (like LLaMA and Mistral)?",
        "code": "RMSNorm(x) = (x / RMS(x)) * g\nwhere RMS(x) = sqrt((1/d) * sum(x_i^2) + epsilon)",
        "options": [
          "It drops the mean-centering step, reducing computational overhead by ~10-50% while preserving scale-invariance and training stability.",
          "It eliminates all learnable scaling parameters.",
          "It converts floating-point activations into integers.",
          "It prevents models from generating repetitive tokens."
        ],
        "answer": 0,
        "explanation": "Zhang & Sennrich demonstrated that the mean-centering operation in LayerNorm does not contribute to training stability. RMSNorm only scales by root mean square, saving memory operations and execution time."
      },
      {
        "id": "ai_a_10",
        "q": "In Vector Databases for RAG (Retrieval-Augmented Generation), what algorithm does HNSW use for Approximate Nearest Neighbor search?",
        "code": "# Vector indexing: Hierarchical Navigable Small World",
        "options": [
          "Multi-layer hierarchical graphs where top layers have long-range skip connections and bottom layers have dense local clustering, providing logarithmic O(log N) search complexity.",
          "Exhaustive brute-force cosine distance across all stored vectors.",
          "Linear scanning through a B-Tree index on primary keys.",
          "Hashing vectors into fixed 1D buckets using MD5."
        ],
        "answer": 0,
        "explanation": "HNSW builds stratified proximity graphs inspired by skip lists. Top layers perform coarse routing with large skip distances, zooming down to dense bottom layers for precise nearest-neighbor clustering in O(log N)."
      },
      {
        "id": "ai_a_11",
        "q": "Why does FlashAttention achieve up to 3-5x wall-clock speedup on GPUs compared to standard attention?",
        "code": "// FlashAttention: Tiling & Online Softmax in GPU SRAM",
        "options": [
          "It tiles input blocks and computes online softmax incrementally inside fast GPU On-Chip SRAM, never materializing the large O(N^2) attention matrix to slow High-Bandwidth Memory (HBM).",
          "It replaces float16 computations with 1-bit integer operations.",
          "It skips computing attention on half the tokens in the sequence.",
          "It executes attention queries asynchronously on CPU host memory."
        ],
        "answer": 0,
        "explanation": "Standard attention is memory-bandwidth bound due to writing and reading the N x N attention matrix from HBM. FlashAttention tiles computations in SRAM using online softmax to avoid HBM I/O."
      },
      {
        "id": "ai_a_12",
        "q": "In Low-Rank Adaptation (LoRA) for parameter-efficient fine-tuning (PEFT), how are weight updates parameterized?",
        "code": "W_new = W_0 + (alpha / r) * (B * A)\nwhere W_0 is (d x k), B is (d x r), A is (r x k), and r << d",
        "options": [
          "The pre-trained weight matrix W_0 is frozen, and updates are factorized into two low-rank matrices A and B with rank r, reducing trainable parameters by over 99%.",
          "Weights are compressed using gzip inside the forward pass.",
          "Only bias parameters are trained, while all matrices are deleted.",
          "LoRA converts all floating-point numbers into 4-bit integers permanently."
        ],
        "answer": 0,
        "explanation": "LoRA freezes the base weights W_0 and models delta updates as delta_W = B x A, where rank r is tiny (e.g. 4, 8, 16), drastically cutting optimizer memory and trainable parameter count."
      },
      {
        "id": "ai_a_13",
        "q": "What mathematical property makes Rotary Position Embedding (RoPE) superior to absolute sinusoidal embeddings in modern LLMs (e.g. LLaMA)?",
        "code": "// RoPE: Embedding relative position through 2D orthogonal rotation matrices",
        "options": [
          "It injects positional information by rotating query and key representations in complex planes, ensuring the inner product between Q and K depends purely on relative distance (m - n).",
          "It allows models to ignore token positions entirely.",
          "It eliminates the need for Key and Value projections.",
          "It bounds vocabulary size to exactly 32,000 tokens."
        ],
        "answer": 0,
        "explanation": "RoPE applies rotation matrices to 2D sub-vectors of queries and keys such that their dot product naturally encodes the relative distance (m - n) between tokens, preserving relative position invariances."
      },
      {
        "id": "ai_a_14",
        "q": "How does Grouped-Query Attention (GQA) reduce KV cache memory consumption during LLM inference compared to Multi-Head Attention (MHA)?",
        "code": "# MHA: 32 Q heads, 32 K heads, 32 V heads\n# GQA: 32 Q heads, 8 K heads, 8 V heads (group size 4)",
        "options": [
          "Multiple query heads share a single Key and Value head pair, slashing KV cache memory footprint by the group ratio while maintaining model quality close to MHA.",
          "It discards past tokens when the context exceeds 2048 tokens.",
          "It compresses the KV cache using 1-bit quantization.",
          "It processes attention queries sequentially on a single core."
        ],
        "answer": 0,
        "explanation": "GQA groups query heads to share a smaller number of key/value heads. In 8-group GQA, KV cache size is reduced by 75-87.5%, drastically cutting memory bottlenecks during generation."
      },
      {
        "id": "ai_a_15",
        "q": "How does Direct Preference Optimization (DPO) simplify LLM alignment compared to RLHF with PPO?",
        "code": "Loss_DPO = -E[log(sigmoid(beta * log(pi(y_w|x)/ref(y_w|x)) - beta * log(pi(y_l|x)/ref(y_l|x))))]",
        "options": [
          "It reparameterizes the reward model directly as an implicit function of policy probabilities, optimizing preferences via a closed-form binary cross-entropy loss without training a separate reward model or using complex RL loops.",
          "It uses reinforcement learning agents to simulate human feedback.",
          "It requires 10 times more compute than traditional PPO.",
          "It eliminates the reference model entirely."
        ],
        "answer": 0,
        "explanation": "DPO mathematically shows that the optimal policy under the Bradley-Terry preference model can be derived directly from the policy probabilities, bypassing the instability of training reward models and PPO."
      },
      {
        "id": "ai_a_16",
        "q": "What is the core principle behind Speculative Decoding in LLM acceleration?",
        "code": "// Speculative Decoding: Draft Model + Target Model verification",
        "options": [
          "A small, fast draft model generates candidate tokens sequentially, and the larger target model verifies all candidate tokens in parallel in a single forward pass, accepting valid tokens.",
          "The model predicts the next 10 tokens using statistical n-grams only.",
          "Speculative decoding quantizes the model to 2-bit weights during inference.",
          "It computes tokens before the user submits a prompt."
        ],
        "answer": 0,
        "explanation": "Running a large model on multiple tokens in parallel takes nearly the same time as running on one token. A small draft model guesses tokens cheaply, and the large model validates them simultaneously."
      },
      {
        "id": "ai_a_17",
        "q": "In QLoRA (Quantized Low-Rank Adaptation), what special 4-bit data type is introduced for optimal quantization of normally distributed weights?",
        "code": "NF4 (NormalFloat4)",
        "options": [
          "NormalFloat4 (NF4), an information-theoretically optimal quantile quantization data type for zero-mean normal distribution parameters.",
          "Integer4 (INT4) with symmetric truncation.",
          "FloatingPoint4 (FP4) with 1 sign bit and 3 mantissa bits.",
          "Binary1 with stochastic rounding."
        ],
        "answer": 0,
        "explanation": "Neural network weights typically follow a normal distribution. NF4 constructs quantile bins that assign equal numbers of values to each bin, maximizing information retention in 4 bits."
      },
      {
        "id": "ai_a_18",
        "q": "In Mixture of Experts (MoE) architectures (e.g. Mixtral 8x7B), what mechanism ensures all experts are trained evenly and avoids expert collapse?",
        "code": "Loss_total = Loss_task + alpha * Loss_aux (Load Balancing Loss)",
        "options": [
          "An auxiliary Load Balancing Loss added to the training objective that penalizes router gates from routing all tokens to the same top experts.",
          "Hardcoding a round-robin rotation for every token.",
          "Disabling backpropagation for overactive experts.",
          "Training each expert on a separate day."
        ],
        "answer": 0,
        "explanation": "Without auxiliary load balancing, routers fall into a self-reinforcing winner-take-all feedback loop where only a few experts receive tokens and gradient updates, leaving others dead."
      },
      {
        "id": "ai_a_19",
        "q": "What equation calculates the memory footprint of the Key-Value (KV) cache for an autoregressive Transformer model during generation?",
        "code": "# b: batch size, s: sequence length, l: number of layers, h: number of heads, d: head dimension, p: precision bytes",
        "options": [
          "2 * b * s * l * h * d * bytes_per_element (factor of 2 accounts for both Keys and Values)",
          "b * s * l * h * d * bytes_per_element",
          "4 * b * s^2 * bytes_per_element",
          "s * l * log(h) * bytes_per_element"
        ],
        "answer": 0,
        "explanation": "For every generated token, both Key and Value vectors across all layers, heads, and dimensions must be cached: 2 * batch * seq_len * num_layers * num_heads * head_dim * bytes."
      },
      {
        "id": "ai_a_20",
        "q": "In Contrastive Learning architectures (like SimCLR and CLIP), what loss function maximizes agreement between positive pairs while pushing negative pairs apart?",
        "code": "L = -log(exp(sim(z_i, z_j) / tau) / sum(exp(sim(z_i, z_k) / tau)))",
        "options": [
          "InfoNCE Loss (Normalized Temperature-scaled Cross Entropy)",
          "Mean Absolute Percentage Error (MAPE)",
          "Huber Loss",
          "Wasserstein GAN Loss"
        ],
        "answer": 0,
        "explanation": "InfoNCE loss treats positive pairs (augmented views or matched image-text embeddings) as target classes in a softmax over cosine similarities scaled by temperature tau."
      }
    ]
  }
};

  /* -------------------------------------------------------------
     Deterministic Seeded PRNG (Mulberry32)
     Generates user-specific, daily-specific, and attempt-specific
     pseudo-random streams.
  ------------------------------------------------------------- */
  function createPrng(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  /* Fisher-Yates shuffle using seeded PRNG */
  function seededShuffle(arr, prng) {
    const list = [...arr];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  /* Shuffle options and remap correct answer index to evenly distribute A, B, C, D */
  function shuffleQuestionOptions(q, prng) {
    const originalCorrectText = q.options[q.answer];
    const shuffledOptions = seededShuffle(q.options, prng);
    const newAnswerIndex = shuffledOptions.indexOf(originalCorrectText);
    return {
      ...q,
      options: shuffledOptions,
      answer: newAnswerIndex
    };
  }

  /* -------------------------------------------------------------
     Luck-Based Trophy Roll Engine (1 to 10 Trophies)
     Minimum = 1 Trophy, Maximum = 10 Trophies.
     10 Trophies ratio is strictly low (< 1% apex jackpot).
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

    startSession(topicKey, levelKey, userEmail = "anonymous", dateKey = "", attemptIndex = 0) {
      const topicData = QUIZ_BANK[topicKey];
      if (!topicData || !topicData[levelKey]) {
        throw new Error("Invalid topic or difficulty level chosen.");
      }

      const cleanEmail = String(userEmail || "anonymous").trim().toLowerCase();
      const cleanDate = String(dateKey || new Date().toISOString().slice(0, 10));
      const cleanAttempt = Number(attemptIndex) || 0;

      // Seed uniquely per user, date, attempt, topic, and difficulty level
      const seedString = `${cleanEmail}_${cleanDate}_att${cleanAttempt}_${topicKey}_${levelKey}`;
      const prng = createPrng(seedString);

      // Clone candidate question pool (20 questions)
      const rawPool = JSON.parse(JSON.stringify(topicData[levelKey]));

      // Seeded shuffle of the 20-question deck and select top 10
      const shuffledDeck = seededShuffle(rawPool, prng);
      const selectedTen = shuffledDeck.slice(0, 10);

      // Dynamically shuffle options for every question so answers are evenly distributed across A, B, C, D (~25% each)
      const finalQuestions = selectedTen.map((q, idx) => {
        const optionPrng = createPrng(`${seedString}_q${q.id}_${idx}`);
        return shuffleQuestionOptions(q, optionPrng);
      });

      session = {
        topic: topicKey,
        topicTitle: topicData.title,
        topicIcon: topicData.icon,
        level: levelKey,
        questions: finalQuestions,
        currentIndex: 0,
        userAnswers: new Array(finalQuestions.length).fill(null),
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
