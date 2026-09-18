/**
 * Daily Grind Tracker — Skill Quiz Arena Engine (v3.1)
 * Topics & Domains:
 *  1. Core Engineering (Data Science, Web Development, AI / ML)
 *  2. Programming Languages (Python, Java, JavaScript, C, C++, Rust, Kotlin, React)
 *  3. Mathematics (Calculus, Linear Algebra, Probability & Statistics, Discrete Mathematics)
 *  4. English & Verbal (Grammar & Sentence Correction, Vocabulary & Verbal Ability)
 *  5. Reasoning & Aptitude (Logical Reasoning & Puzzles, Analytical Reasoning & Sequences)
 *
 * Difficulty Tiers & Timer Rules:
 *  - Beginner: 20 Minutes (1200 seconds) for 10 Questions
 *  - Intermediate: 20 Minutes (1200 seconds) for 10 Questions
 *  - Advanced: 40 Minutes (2400 seconds) for 10 Questions
 *
 * Daily Play Limits & Trophy Rules:
 *  - Max 3 Quizzes per day, then locked until midnight
 *  - Score 10 / 10 => 7 Trophies (+7 🏆)
 *  - Score 5 - 9 / 10 => 3 Trophies (+3 🏆)
 *  - Score 0 - 4 / 10 => 0 Trophies (0 🏆)
 *  - Close Quiz action returns directly to Dashboard
 *  - Daily Non-Repeating Question Selector with History Tracking
 */

(function () {
  function sfc32(a, b, c, d) {
    return function () {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
      let t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = c << 21 | c >>> 11;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function createPrng(seedStr) {
    const h = hashString(seedStr || "dailygrind");
    return sfc32(h, h + 12345, h + 67890, h + 13579);
  }

  function seededShuffle(array, prng) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function shuffleQuestionOptions(question, prng) {
    const originalAnswerText = question.options[question.answer];
    const shuffledOptions = seededShuffle(question.options, prng);
    const newAnswerIndex = shuffledOptions.indexOf(originalAnswerText);
    return {
      ...question,
      options: shuffledOptions,
      answer: newAnswerIndex
    };
  }

  const DOMAINS = {
  "core": {
    "id": "core",
    "title": "Core Engineering & Applied AI",
    "icon": "⚡",
    "desc": "Data Science, Modern Web Systems, Machine Learning & Transformer internals.",
    "topics": [
      {
        "id": "datascience",
        "name": "Data Science",
        "icon": "📊",
        "tag": "Python · Pandas · SQL · Stats"
      },
      {
        "id": "webdev",
        "name": "Web Development",
        "icon": "🌐",
        "tag": "JS · DOM · CSS Grid · APIs"
      },
      {
        "id": "aiml",
        "name": "AI / Machine Learning",
        "icon": "🤖",
        "tag": "Deep Learning · LLMs · Transformers"
      }
    ]
  },
  "programming": {
    "id": "programming",
    "title": "Programming Languages",
    "icon": "💻",
    "desc": "Algorithms, syntax, memory models, runtime internals, and interview problem-solving.",
    "topics": [
      {
        "id": "prog_python",
        "name": "Python",
        "icon": "🐍",
        "tag": "Generators · GIL · Decorators"
      },
      {
        "id": "prog_java",
        "name": "Java",
        "icon": "☕",
        "tag": "JVM · OOP · Concurrency"
      },
      {
        "id": "prog_javascript",
        "name": "JavaScript",
        "icon": "⚡",
        "tag": "Event Loop · Closures · Async"
      },
      {
        "id": "prog_c",
        "name": "C Language",
        "icon": "⚙️",
        "tag": "Pointers · Memory · Structs"
      },
      {
        "id": "prog_cpp",
        "name": "C++",
        "icon": "🚀",
        "tag": "STL · RAII · Smart Pointers"
      },
      {
        "id": "prog_rust",
        "name": "Rust",
        "icon": "🦀",
        "tag": "Ownership · Borrowing · Lifetimes"
      },
      {
        "id": "prog_kotlin",
        "name": "Kotlin",
        "icon": "🎯",
        "tag": "Null Safety · Coroutines"
      },
      {
        "id": "prog_react",
        "name": "React",
        "icon": "⚛️",
        "tag": "Hooks · VDOM · Reconciliation"
      }
    ]
  },
  "math": {
    "id": "math",
    "title": "Mathematics",
    "icon": "📐",
    "desc": "Calculus, Linear Algebra, Probability & Statistics, and Discrete Mathematics.",
    "topics": [
      {
        "id": "math_calculus",
        "name": "Calculus",
        "icon": "∫",
        "tag": "Derivatives · Integrals · Limits"
      },
      {
        "id": "math_linear_algebra",
        "name": "Linear Algebra",
        "icon": "🔢",
        "tag": "Matrices · Eigenvalues · Rank"
      },
      {
        "id": "math_prob_stats",
        "name": "Probability & Stats",
        "icon": "📊",
        "tag": "Bayes · Distributions · Variance"
      },
      {
        "id": "math_discrete",
        "name": "Discrete Math",
        "icon": "🧠",
        "tag": "Graphs · Combinatorics · Logic"
      }
    ]
  },
  "english": {
    "id": "english",
    "title": "English & Verbal Ability",
    "icon": "📖",
    "desc": "Grammar, sentence correction, verbal aptitude, analogies, and vocabulary.",
    "topics": [
      {
        "id": "english_grammar",
        "name": "Grammar & Usage",
        "icon": "📝",
        "tag": "Tenses · Modifiers · Agreement"
      },
      {
        "id": "english_verbal",
        "name": "Vocabulary & Verbal",
        "icon": "📚",
        "tag": "Synonyms · Idioms · Analogies"
      }
    ]
  },
  "reasoning": {
    "id": "reasoning",
    "title": "Reasoning & Aptitude",
    "icon": "🧩",
    "desc": "Logical deduction, seating puzzles, series, coding-decoding, and critical thinking.",
    "topics": [
      {
        "id": "reasoning_logical",
        "name": "Logical Reasoning",
        "icon": "🧩",
        "tag": "Syllogisms · Puzzles · Relations"
      },
      {
        "id": "reasoning_analytical",
        "name": "Analytical Aptitude",
        "icon": "🔍",
        "tag": "Series · Coding · Deduction"
      }
    ]
  }
};

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
  },
  "prog_python": {
    "title": "Python Programming",
    "icon": "🐍",
    "questions": [
      {
        "id": "py_1",
        "q": "What is the output of the following list comprehension with a conditional filter?",
        "code": "nums = [1, 2, 3, 4, 5, 6]\nres = [x**2 for x in nums if x % 2 == 0]\nprint(res)",
        "options": [
          "[4, 16, 36]",
          "[1, 9, 25]",
          "[2, 4, 6]",
          "[4, 8, 12]"
        ],
        "answer": 0,
        "explanation": "The filter 'if x % 2 == 0' selects even numbers [2, 4, 6], and squaring them yields [4, 16, 36]."
      },
      {
        "id": "py_2",
        "q": "What is the common pitfall with mutable default arguments in Python functions?",
        "code": "def add_item(val, target=[]):\n    target.append(val)\n    return target\n\nprint(add_item(1))\nprint(add_item(2))",
        "options": [
          "[1] then [1, 2]",
          "[1] then [2]",
          "TypeError: mutable default",
          "[1] then [1]"
        ],
        "answer": 0,
        "explanation": "Default parameter expressions in Python are evaluated once when the function is defined, so the same list object is shared across subsequent calls."
      },
      {
        "id": "py_3",
        "q": "In Python, what is the fundamental difference between the 'is' operator and '==' operator?",
        "options": [
          "'is' checks memory identity (id), while '==' checks equality of values.",
          "'==' checks memory identity, while 'is' checks value equality.",
          "They are exact synonyms with identical bytecode.",
          "'is' is used only for strings and numbers."
        ],
        "answer": 0,
        "explanation": "'is' checks if two variables refer to the exact same object in memory, while '==' invokes the __eq__ method to compare values."
      },
      {
        "id": "py_4",
        "q": "What is the average time complexity of checking membership ('x in s') in a Python set versus a list?",
        "options": [
          "O(1) for set, O(n) for list",
          "O(n) for set, O(1) for list",
          "O(log n) for both",
          "O(1) for both"
        ],
        "answer": 0,
        "explanation": "Python sets use hash tables allowing O(1) average lookup, whereas lists require O(n) linear search."
      },
      {
        "id": "py_5",
        "q": "What is the primary role of Python's Global Interpreter Lock (GIL)?",
        "options": [
          "To prevent multiple native threads from executing Python bytecodes simultaneously in CPython.",
          "To speed up asynchronous I/O operations.",
          "To encrypt Python memory for security.",
          "To allocate stack memory for local variables."
        ],
        "answer": 0,
        "explanation": "The GIL is a mutex in CPython that protects access to Python objects, preventing race conditions by allowing only one native thread to run bytecode at a time."
      },
      {
        "id": "py_6",
        "q": "What will the following generator function output when iterated with next()?",
        "code": "def gen():\n    yield 1\n    yield 2\n    return 3\n\ng = gen()\nprint(next(g), next(g))",
        "options": [
          "1 2",
          "1 2 3",
          "3 2 1",
          "StopIteration"
        ],
        "answer": 0,
        "explanation": "The generator yields 1 then 2. The return value 3 is attached to the StopIteration exception when exhausted."
      },
      {
        "id": "py_7",
        "q": "What is the optimal LeetCode approach for 'Two Sum' to achieve O(n) time complexity?",
        "options": [
          "Use a hash map to store each number's complement (target - num) and its index.",
          "Sort the array and use binary search for every element (O(n log n)).",
          "Use two nested loops to check every pair (O(n^2)).",
          "Use dynamic programming with an n x target matrix."
        ],
        "answer": 0,
        "explanation": "A single pass with a hash map stores visited numbers and checks if the complement (target - current) exists in O(1) time, giving O(n) overall."
      },
      {
        "id": "py_8",
        "q": "What is the type of variable x in: x = (42)?",
        "code": "x = (42)\nprint(type(x))",
        "options": [
          "<class 'int'>",
          "<class 'tuple'>",
          "<class 'list'>",
          "SyntaxError"
        ],
        "answer": 0,
        "explanation": "A single element inside parentheses without a trailing comma is simply an integer in grouping parentheses. To create a tuple, use (42,)."
      },
      {
        "id": "py_9",
        "q": "What does the @functools.wraps decorator do when creating custom decorators?",
        "options": [
          "It preserves the original function's metadata like __name__ and __doc__.",
          "It compiles the decorated function into C bytecode for speed.",
          "It automatically memoizes return values.",
          "It catches all runtime exceptions thrown by the wrapper."
        ],
        "answer": 0,
        "explanation": "@functools.wraps copies the original function's name, docstring, and annotations to the wrapper function, preventing metadata loss."
      },
      {
        "id": "py_10",
        "q": "What happens when you use a mutable object like a list as a key in a Python dictionary?",
        "code": "d = {}\nd[[1, 2]] = 'val'",
        "options": [
          "TypeError: unhashable type: 'list'",
          "It is inserted with hash computed from list values.",
          "KeyError: invalid key",
          "It is converted to a string automatically."
        ],
        "answer": 0,
        "explanation": "Dictionary keys must be hashable and immutable. Lists are mutable and do not implement __hash__, raising a TypeError."
      },
      {
        "id": "py_11",
        "q": "In Python OOP, what is the key difference between __new__ and __init__?",
        "options": [
          "__new__ creates and returns the instance, while __init__ initializes it.",
          "__init__ allocates memory, while __new__ sets attributes.",
          "__new__ is called after __init__ completes.",
          "There is no difference; __new__ is an alias for __init__."
        ],
        "answer": 0,
        "explanation": "__new__ is the static constructor that creates and returns a new object instance. __init__ receives this instance as 'self' to initialize its fields."
      },
      {
        "id": "py_12",
        "q": "What does the 'with' statement use under the hood in Python for resource management?",
        "options": [
          "Context Manager protocol with __enter__ and __exit__ methods.",
          "Iterators with __iter__ and __next__ methods.",
          "Garbage collection hooks in the sys module.",
          "Operating system thread locks."
        ],
        "answer": 0,
        "explanation": "The 'with' statement invokes __enter__ at the beginning and guarantees __exit__ is called upon leaving the block, even if an error occurs."
      }
    ]
  },
  "prog_javascript": {
    "title": "JavaScript Engine & Core",
    "icon": "⚡",
    "questions": [
      {
        "id": "js_1",
        "q": "In the JavaScript Event Loop, what is the execution order of the following snippet?",
        "code": "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
        "options": [
          "1, 4, 3, 2",
          "1, 2, 3, 4",
          "1, 3, 4, 2",
          "1, 4, 2, 3"
        ],
        "answer": 0,
        "explanation": "Synchronous code runs first ('1', '4'). Microtasks (Promise.then) run next before the next tick ('3'). Macrotasks (setTimeout) execute in the next event loop iteration ('2')."
      },
      {
        "id": "js_2",
        "q": "What does the following closure code print?",
        "code": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 10);\n}",
        "options": [
          "3, 3, 3",
          "0, 1, 2",
          "undefined, undefined, undefined",
          "0, 0, 0"
        ],
        "answer": 0,
        "explanation": "'var' is function-scoped. By the time the timeouts fire, the loop has finished and the shared variable 'i' has reached 3."
      },
      {
        "id": "js_3",
        "q": "Why does 0.1 + 0.2 === 0.3 evaluate to false in JavaScript?",
        "options": [
          "Because IEEE 754 binary floating-point representation produces precision rounding errors.",
          "Because JavaScript converts numbers to 32-bit integers before comparison.",
          "Because addition is asynchronous in V8.",
          "Because 0.3 is treated as a symbol."
        ],
        "answer": 0,
        "explanation": "0.1 and 0.2 cannot be represented exactly in binary floating point, resulting in 0.30000000000000004, which is not strictly equal to 0.3."
      },
      {
        "id": "js_4",
        "q": "How does an arrow function handle the 'this' keyword differently from a traditional function?",
        "options": [
          "Arrow functions do not have their own 'this'; they inherit it lexically from the enclosing scope.",
          "Arrow functions always bind 'this' to the global window object.",
          "Arrow functions allow dynamic re-binding of 'this' using .bind().",
          "Arrow functions bind 'this' to undefined in non-strict mode."
        ],
        "answer": 0,
        "explanation": "Arrow functions capture the 'this' value of the enclosing execution context and cannot be rebound using call(), apply(), or bind()."
      },
      {
        "id": "js_5",
        "q": "What is the key difference between Promise.all() and Promise.allSettled()?",
        "options": [
          "Promise.all rejects immediately if any promise rejects, whereas allSettled waits for all promises to resolve or reject.",
          "Promise.all runs sequentially, while allSettled runs in parallel.",
          "Promise.allSettled throws an error if all promises resolve.",
          "There is no difference in modern ES2022+."
        ],
        "answer": 0,
        "explanation": "Promise.all short-circuits on the first rejection. Promise.allSettled waits for all promises to complete and returns an array of objects describing each outcome."
      },
      {
        "id": "js_6",
        "q": "What is the Temporal Dead Zone (TDZ) in JavaScript?",
        "options": [
          "The period between entering scope and variable declaration where accessing let/const throws a ReferenceError.",
          "The time between setTimeout call and execution.",
          "The time taken for garbage collection in the V8 heap.",
          "The delay before Web Workers postMessage returns."
        ],
        "answer": 0,
        "explanation": "Variables declared with 'let' and 'const' are hoisted, but uninitialized until evaluation reaches the declaration line. Accessing them before that causes a ReferenceError."
      },
      {
        "id": "js_7",
        "q": "What is the built-in modern browser JavaScript method to deeply clone complex objects without JSON serialization quirks?",
        "options": [
          "structuredClone(obj)",
          "Object.assign({}, obj)",
          "obj.deepClone()",
          "Reflect.clone(obj)"
        ],
        "answer": 0,
        "explanation": "structuredClone() is the standard algorithm that handles cyclical references, Dates, RegExps, Maps, Sets, and binary TypedArrays safely."
      },
      {
        "id": "js_8",
        "q": "What is the result of typeof NaN in JavaScript?",
        "options": [
          "'number'",
          "'nan'",
          "'undefined'",
          "'object'"
        ],
        "answer": 0,
        "explanation": "According to IEEE 754 and JavaScript specs, NaN represents 'Not a Number', but its primitive data type is still numeric, returning 'number'."
      },
      {
        "id": "js_9",
        "q": "What is the difference between Object.freeze() and Object.seal() in JavaScript?",
        "options": [
          "Object.freeze() prevents adding, deleting, AND modifying properties; Object.seal() prevents adding/deleting but allows modifying existing writable properties.",
          "Object.seal() prevents modification of properties while freeze allows modifying existing ones.",
          "Object.freeze() works deeply on nested objects, while seal() is shallow.",
          "They are identical alias methods in ES6."
        ],
        "answer": 0,
        "explanation": "Object.freeze makes an object completely immutable (configurable: false, writable: false). Object.seal prevents adding/removing properties (configurable: false), but existing writable properties can still be modified."
      },
      {
        "id": "js_10",
        "q": "In LeetCode 'Merge Intervals', what is the initial optimal step to merge overlapping intervals in O(n log n)?",
        "options": [
          "Sort intervals by their start times.",
          "Insert intervals into a max-heap sorted by end time.",
          "Compare all pairs with two nested loops (O(n^2)).",
          "Use a hash table indexed by interval length."
        ],
        "answer": 0,
        "explanation": "Sorting intervals by their starting boundary ensures that all potentially overlapping intervals are adjacent, enabling a single linear pass merge in O(n log n)."
      },
      {
        "id": "js_11",
        "q": "What does the following JavaScript code output regarding variable shadowing and TDZ?",
        "code": "let x = 10;\nfunction test() {\n    console.log(x);\n    let x = 20;\n}\ntest();",
        "options": [
          "ReferenceError: Cannot access 'x' before initialization",
          "10",
          "undefined",
          "20"
        ],
        "answer": 0,
        "explanation": "The inner 'let x' shadows the outer 'x' throughout the entire function scope, but accessing it before its declaration triggers the Temporal Dead Zone (ReferenceError)."
      },
      {
        "id": "js_12",
        "q": "What is the time complexity of Array.prototype.sort() in V8 (Chrome / Node.js)?",
        "options": [
          "O(n log n) using TimSort",
          "O(n^2) using QuickSort",
          "O(n) using Radix Sort",
          "O(log n) using Binary Search"
        ],
        "answer": 0,
        "explanation": "Modern V8 uses TimSort (a hybrid stable sorting algorithm derived from merge sort and insertion sort), providing guaranteed O(n log n) worst-case time complexity."
      }
    ]
  },
  "prog_java": {
    "title": "Java & JVM Core",
    "icon": "☕",
    "questions": [
      {
        "id": "java_1",
        "q": "In Java, what is the consequence of overriding the .equals() method without also overriding .hashCode()?",
        "options": [
          "Objects equal according to equals() will have different hash codes, breaking HashMap and HashSet lookups.",
          "The code will fail to compile with a syntax error.",
          "The garbage collector will instantly deallocate the object.",
          "equals() will automatically fall back to reference identity comparison."
        ],
        "answer": 0,
        "explanation": "The Java contract requires that if a.equals(b) is true, then a.hashCode() must equal b.hashCode(). Breaking this causes HashMaps to store equal keys in different buckets."
      },
      {
        "id": "java_2",
        "q": "What does the following Integer comparison evaluate to in standard Java?",
        "code": "Integer a = 127;\nInteger b = 127;\nInteger c = 128;\nInteger d = 128;\nSystem.out.println((a == b) + \" \" + (c == d));",
        "options": [
          "true false",
          "true true",
          "false false",
          "false true"
        ],
        "answer": 0,
        "explanation": "The JVM caches Integer objects in the range -128 to 127. Values within this range share the same object reference (a == b is true), whereas 128 creates distinct objects (c == d is false)."
      },
      {
        "id": "java_3",
        "q": "In Java 8+, what data structure does a HashMap bucket transform into when it exceeds 8 elements (TREEIFY_THRESHOLD)?",
        "options": [
          "Red-Black Tree (TreeMap / TreeNode)",
          "Doubly Linked List",
          "B-Tree",
          "SkipList"
        ],
        "answer": 0,
        "explanation": "To prevent hash collision DoS attacks and maintain O(log n) worst-case lookup rather than O(n), Java 8 transforms linked lists into Red-Black trees once bucket size exceeds 8."
      },
      {
        "id": "java_4",
        "q": "What is the primary guarantee provided by the 'volatile' keyword on a variable in Java?",
        "options": [
          "Changes made by one thread are immediately visible to all other threads, preventing CPU cache reordering.",
          "It prevents the variable from being reassigned (immutability).",
          "It acquires an intrinsic monitor lock on the object.",
          "It persists the variable value to local disk storage."
        ],
        "answer": 0,
        "explanation": "'volatile' ensures happens-before memory visibility by preventing CPU instruction reordering and flushing reads/writes directly to main memory rather than thread CPU caches."
      },
      {
        "id": "java_5",
        "q": "Where in JVM memory are Java object instances physically allocated?",
        "options": [
          "Heap Memory",
          "Stack Memory",
          "Method Area (Metaspace)",
          "JVM PC Register"
        ],
        "answer": 0,
        "explanation": "All object instances in Java reside on the Heap, while local primitive variables and method call frames are stored on the Stack."
      },
      {
        "id": "java_6",
        "q": "What is the difference between String, StringBuilder, and StringBuffer in Java?",
        "options": [
          "String is immutable; StringBuilder is mutable and not thread-safe; StringBuffer is mutable and thread-safe (synchronized).",
          "StringBuilder is immutable; String and StringBuffer are mutable.",
          "StringBuffer is faster than StringBuilder in single-threaded operations.",
          "They are completely identical in memory allocation."
        ],
        "answer": 0,
        "explanation": "String cannot be modified after creation. StringBuilder offers fast mutable string manipulation without sync overhead. StringBuffer synchronizes methods for thread safety."
      },
      {
        "id": "java_7",
        "q": "In Java, what is the key difference between HashMap and ConcurrentHashMap?",
        "options": [
          "ConcurrentHashMap is thread-safe using bucket/segment-level locking without synchronizing the whole map, while HashMap is not thread-safe.",
          "HashMap is thread-safe while ConcurrentHashMap is designed for single-threaded batch performance.",
          "ConcurrentHashMap allows null keys, while HashMap throws NullPointerException.",
          "HashMap stores data off-heap, while ConcurrentHashMap stores data on the JVM heap."
        ],
        "answer": 0,
        "explanation": "ConcurrentHashMap achieves thread-safety without locking the entire table (using CAS and synchronized on individual bin nodes), whereas HashMap is non-synchronized and causes race conditions."
      },
      {
        "id": "java_8",
        "q": "What is the output of the following Java string comparison?",
        "code": "String s1 = \"grind\";\nString s2 = new String(\"grind\");\nSystem.out.println((s1 == s2) + \" \" + (s1.equals(s2)));",
        "options": [
          "false true",
          "true true",
          "false false",
          "true false"
        ],
        "answer": 0,
        "explanation": "s1 is stored in the String Constant Pool while s2 is allocated as a new object on the heap. '==' compares references (false), while '.equals()' compares character contents (true)."
      },
      {
        "id": "java_9",
        "q": "In Java Generics, what does '? extends T' (covariance) signify according to PECS principle?",
        "options": [
          "Producer Extends: the collection can be read from (produces T), but you cannot add elements to it (except null).",
          "Consumer Extends: you can write elements to the collection, but cannot read from it.",
          "It forces the type to be a subclass of T and enables mutating any item at runtime.",
          "It disables compiler type erasure for performance."
        ],
        "answer": 0,
        "explanation": "PECS stands for 'Producer Extends, Consumer Super'. If you need to read elements from a generic collection, use '? extends T' (it produces instances of T)."
      },
      {
        "id": "java_10",
        "q": "How does the Java Garbage Collector handle objects in the G1 (Garbage-First) collector?",
        "options": [
          "It partitions the heap into equal-sized virtual regions and prioritizes collecting regions with the most garbage first.",
          "It pauses the entire application continuously using Stop-The-World on the single contiguous young gen.",
          "It only frees memory when OutOfMemoryError is thrown.",
          "It deletes objects deterministically the moment they go out of scope like C++ RAII."
        ],
        "answer": 0,
        "explanation": "G1 divides the heap into multiple equal-sized regions (Eden, Survivor, Old) and tracks the amount of live data in each region to collect garbage-heavy regions first."
      },
      {
        "id": "java_11",
        "q": "In LeetCode 'Course Schedule' (detecting cycles in directed graph), which algorithm is standard in Java?",
        "options": [
          "Topological Sort using Kahn's Algorithm (BFS with In-degree) or DFS with 3-color cycle detection.",
          "Dijkstra's Shortest Path Algorithm.",
          "Kruskal's Minimum Spanning Tree Algorithm.",
          "Binary Search on course IDs."
        ],
        "answer": 0,
        "explanation": "Course Schedule models prerequisites as a directed graph. A cycle means prerequisites cannot be completed. Kahn's BFS (in-degree array) or DFS with visited states detects cycles in O(V + E)."
      },
      {
        "id": "java_12",
        "q": "What happens when you invoke thread.start() vs thread.run() in Java?",
        "options": [
          "start() creates a new native OS thread and invokes run() on it; calling run() directly executes on the caller's current thread.",
          "run() spawns a daemon thread; start() spawns a user thread.",
          "start() is deprecated in Java 21; only run() is valid.",
          "Both spawn asynchronous native worker threads identically."
        ],
        "answer": 0,
        "explanation": "thread.start() performs JVM native state initialization and allocates an OS thread. Calling run() directly is just a standard synchronous method call on the calling thread."
      }
    ]
  },
  "prog_c": {
    "title": "C Language & Systems",
    "icon": "⚙️",
    "questions": [
      {
        "id": "c_1",
        "q": "If 'int *ptr = 1000;' on a system where sizeof(int) is 4 bytes, what is the value of ptr + 2?",
        "options": [
          "1008",
          "1002",
          "1004",
          "1016"
        ],
        "answer": 0,
        "explanation": "Pointer arithmetic increments by the number of elements multiplied by sizeof(type): 1000 + (2 * 4) = 1008."
      },
      {
        "id": "c_2",
        "q": "What is the crucial difference between malloc() and calloc() in the C standard library?",
        "options": [
          "calloc() initializes allocated memory to zero; malloc() leaves memory uninitialized (garbage values).",
          "malloc() allocates on the stack; calloc() allocates on the heap.",
          "calloc() cannot allocate arrays of structs.",
          "malloc() automatically frees memory when out of scope."
        ],
        "answer": 0,
        "explanation": "calloc(n, size) allocates contiguous memory and clears every byte to 0, whereas malloc(size) allocates raw uninitialized heap memory."
      },
      {
        "id": "c_3",
        "q": "What is a 'dangling pointer' in C?",
        "options": [
          "A pointer pointing to a memory location that has already been deallocated (freed).",
          "A pointer that has never been initialized.",
          "A pointer with value NULL.",
          "A pointer pointing to another pointer."
        ],
        "answer": 0,
        "explanation": "A dangling pointer arises when memory is freed via free(ptr), but the pointer variable continues pointing to that invalid memory address."
      },
      {
        "id": "c_4",
        "q": "Why do C compilers add structure padding (alignment bytes) inside structs?",
        "options": [
          "To align data fields to CPU word boundaries for faster hardware memory bus access.",
          "To prevent stack overflow attacks.",
          "To make all structs exactly 64 bytes.",
          "To encrypt struct fields in memory."
        ],
        "answer": 0,
        "explanation": "CPUs read memory in chunks of 4 or 8 bytes. Accessing misaligned data requires multiple memory bus cycles. Padding ensures optimal single-cycle reads."
      },
      {
        "id": "c_5",
        "q": "What does the following bitwise XOR swap trick accomplish?",
        "code": "a ^= b;\nb ^= a;\na ^= b;",
        "options": [
          "Swaps values of a and b without needing a temporary variable.",
          "Sets both a and b to 0.",
          "Calculates the bitwise sum of a and b.",
          "Inverts all bits of variable a."
        ],
        "answer": 0,
        "explanation": "Because x ^ x = 0 and x ^ 0 = x, three sequential XOR operations swap the contents of registers a and b without extra memory."
      },
      {
        "id": "c_6",
        "q": "What is the behavior of calling free() on a pointer and subsequently dereferencing it in C?",
        "code": "int *p = (int *)malloc(sizeof(int));\n*p = 42;\nfree(p);\nprintf(\"%d\\n\", *p);",
        "options": [
          "Undefined Behavior (Dangling Pointer / Use-After-Free).",
          "Guaranteed segmentation fault on all operating systems.",
          "Always prints 0 because memory is cleared.",
          "Always prints 42 without issue."
        ],
        "answer": 0,
        "explanation": "Dereferencing freed memory is classic Undefined Behavior (UB). The memory page may still be accessible or reallocated to another process component."
      },
      {
        "id": "c_7",
        "q": "What is the difference between 'char str[] = \"hello\";' and 'char *str = \"hello\";' in C?",
        "options": [
          "'char str[]' creates a modifiable array on the stack; 'char *str' points to read-only string literal memory.",
          "'char *str' is modifiable while 'char str[]' is read-only.",
          "Both allocate heap memory via invisible malloc calls.",
          "They have identical memory layouts and write capabilities."
        ],
        "answer": 0,
        "explanation": "Array declaration copies the string characters into local stack memory (which can be edited), while pointer declaration points directly to the read-only text/data segment (modifying it causes a segmentation fault)."
      },
      {
        "id": "c_8",
        "q": "In C, what does the 'volatile' keyword signify to the compiler optimizer?",
        "options": [
          "Tells the compiler that the variable's value may change unexpectedly (e.g., hardware register or interrupt) and prevents caching it in a CPU register.",
          "Guarantees that access to the variable is atomic and thread-safe.",
          "Allocates the variable in CPU L1 cache memory for highest speed.",
          "Prevents the variable from ever being modified by any function."
        ],
        "answer": 0,
        "explanation": "The volatile qualifier warns the optimizer that the variable can be altered by external factors (hardware, ISR), forcing every read and write to access RAM directly."
      },
      {
        "id": "c_9",
        "q": "What is the output of sizeof on an array parameter passed to a function in C?",
        "code": "void check(int arr[10]) {\n    printf(\"%zu\\n\", sizeof(arr));\n}",
        "options": [
          "Size of a pointer (e.g., 8 bytes on 64-bit architecture), because arrays decay to pointers when passed as parameters.",
          "40 bytes (10 * sizeof(int)).",
          "10 bytes.",
          "Compilation error: cannot take sizeof parameter."
        ],
        "answer": 0,
        "explanation": "In C, array parameters decay into pointer types in function arguments ('int arr[10]' becomes 'int *arr'). Thus sizeof(arr) yields sizeof(int*)."
      },
      {
        "id": "c_10",
        "q": "What does memory alignment and structure padding achieve in C?",
        "options": [
          "Allows CPU hardware to read multi-byte data types efficiently in single bus memory cycles.",
          "Compresses the total RAM footprint of structs to minimum bytes.",
          "Encrypts struct fields to prevent memory dumping.",
          "Ensures structs can be serialized to JSON automatically."
        ],
        "answer": 0,
        "explanation": "Processors access memory faster when 4-byte or 8-byte values align to memory addresses divisible by 4 or 8. The compiler inserts padding bytes between struct members to satisfy alignment rules."
      },
      {
        "id": "c_11",
        "q": "In LeetCode 'Reverse Linked List', what is the iterative pointer manipulation technique in C?",
        "code": "struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head, *next = NULL;\n    while (curr) {\n        next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}",
        "options": [
          "O(n) time and O(1) space by tracking prev, curr, and next pointers in a single pass.",
          "O(n^2) time by repeatedly swapping values.",
          "O(n) auxiliary space using recursive function stack frames.",
          "O(log n) time using binary split reversal."
        ],
        "answer": 0,
        "explanation": "The classic 3-pointer iterative reversal reverses next pointers one node at a time in O(n) linear time with O(1) constant space."
      },
      {
        "id": "c_12",
        "q": "What is the role of the 'static' keyword when declared on a global function or variable in C?",
        "options": [
          "Restricts the linkage and visibility of the symbol to the current translation unit (.c file).",
          "Forces the variable to be allocated in thread-local storage.",
          "Makes the function inline for compiler loop unrolling.",
          "Makes the variable immutable like const."
        ],
        "answer": 0,
        "explanation": "Static at file scope grants internal linkage, meaning the identifier cannot be accessed or resolved by the linker from other translation units."
      }
    ]
  },
  "prog_cpp": {
    "title": "C++ & Modern STL",
    "icon": "🚀",
    "questions": [
      {
        "id": "cpp_1",
        "q": "What is the core principle of RAII (Resource Acquisition Is Initialization) in C++?",
        "options": [
          "Holding a resource is tied to object lifetime; resource is acquired in constructor and released in destructor.",
          "All variables must be initialized to 0 on declaration.",
          "Resources can only be allocated through dynamic raw pointers.",
          "Every class must implement an explicit clone method."
        ],
        "answer": 0,
        "explanation": "RAII guarantees resource management (memory, file handles, mutex locks) by binding cleanup to stack-unwinding destructors, preventing leaks even on exceptions."
      },
      {
        "id": "cpp_2",
        "q": "Why must a base class have a 'virtual' destructor if derived objects are deleted through base pointers?",
        "options": [
          "To ensure the derived class destructor is invoked, preventing resource leaks and undefined behavior.",
          "To enable multiple inheritance.",
          "To speed up compiler inline optimizations.",
          "To prevent derived classes from having private fields."
        ],
        "answer": 0,
        "explanation": "Without a virtual destructor, 'delete basePtr' will only call the base destructor, leaking any resources allocated by the derived class."
      },
      {
        "id": "cpp_3",
        "q": "What is the difference between std::vector::push_back and std::vector::emplace_back?",
        "options": [
          "emplace_back constructs the element in-place inside the container, avoiding extra copy/move operations.",
          "push_back is faster because it uses move semantics exclusively.",
          "emplace_back only works with primitive types.",
          "There is no difference in C++11 and above."
        ],
        "answer": 0,
        "explanation": "emplace_back forwards its arguments directly to the element constructor in the vector's storage, eliminating temporary object creation."
      },
      {
        "id": "cpp_4",
        "q": "What is the ownership model of std::unique_ptr in Modern C++?",
        "options": [
          "Exclusive ownership: cannot be copied, can only be transferred using std::move.",
          "Shared ownership with reference counting.",
          "Garbage collected by the runtime.",
          "Weak reference that automatically expires."
        ],
        "answer": 0,
        "explanation": "std::unique_ptr enforces sole ownership of a resource. Its copy constructor is deleted, so ownership transfer requires explicit move semantics."
      },
      {
        "id": "cpp_5",
        "q": "What is the time complexity of lookup in std::map versus std::unordered_map?",
        "options": [
          "std::map is O(log n) (Red-Black tree); std::unordered_map is O(1) average (Hash table).",
          "std::map is O(1); std::unordered_map is O(log n).",
          "Both are O(n) worst case only.",
          "Both are O(log n) in all cases."
        ],
        "answer": 0,
        "explanation": "std::map maintains elements in sorted order using a self-balancing binary search tree (O(log n)), while std::unordered_map uses hash buckets for O(1) average access."
      },
      {
        "id": "cpp_6",
        "q": "What is the key principle behind RAII (Resource Acquisition Is Initialization) in modern C++?",
        "options": [
          "Binding the lifecycle of resources (heap memory, sockets, locks) to the lifetime of stack objects via constructors and destructors.",
          "Initialising all variables to zero upon application boot.",
          "Using garbage collection threads to sweep dead pointers.",
          "Compiling templates at initialization time instead of runtime."
        ],
        "answer": 0,
        "explanation": "RAII guarantees that resources are acquired in constructors and deterministically released in destructors when objects leave scope, even when exceptions are thrown."
      },
      {
        "id": "cpp_7",
        "q": "What is the difference between std::unique_ptr and std::shared_ptr in modern C++?",
        "options": [
          "std::unique_ptr enforces exclusive single ownership with zero overhead; std::shared_ptr uses reference counting for shared ownership.",
          "std::unique_ptr can be copied anywhere; std::shared_ptr cannot be copied.",
          "std::shared_ptr is only for primitive types; std::unique_ptr is for custom classes.",
          "std::unique_ptr has higher memory overhead due to atomic control blocks."
        ],
        "answer": 0,
        "explanation": "std::unique_ptr cannot be copied (move-only) and has zero runtime overhead over a raw pointer. std::shared_ptr maintains a thread-safe reference count in an allocated control block."
      },
      {
        "id": "cpp_8",
        "q": "What does std::move actually do in C++11 and later?",
        "code": "std::string a = \"Grind\";\nstd::string b = std::move(a);",
        "options": [
          "It performs an unconditional static_cast to an rvalue reference (T&&), enabling move constructors without copying bytes.",
          "It actively copies memory from address a to address b and frees address a.",
          "It creates an asynchronous thread to move data in the background.",
          "It sets variable a to null immediately at compile time."
        ],
        "answer": 0,
        "explanation": "std::move does not move anything by itself; it merely casts an lvalue to an rvalue reference (static_cast<T&&>), signaling to constructors/operators that the resource may be stolen."
      },
      {
        "id": "cpp_9",
        "q": "What is the average time complexity of insertion, deletion, and lookup in std::unordered_map vs std::map in C++?",
        "options": [
          "std::unordered_map is O(1) average (hash table); std::map is O(log n) (Red-Black self-balancing BST).",
          "std::unordered_map is O(log n); std::map is O(1).",
          "Both are strictly O(1) in all circumstances.",
          "Both are O(n) linear search collections."
        ],
        "answer": 0,
        "explanation": "std::unordered_map is backed by hash buckets giving O(1) average lookup, whereas std::map is a Red-Black tree maintaining sorted keys with O(log n) guaranteed operations."
      },
      {
        "id": "cpp_10",
        "q": "In LeetCode 'Trapping Rain Water', what is the two-pointer technique in C++ that achieves O(n) time and O(1) space?",
        "options": [
          "Maintain left and right pointers with leftMax and rightMax, filling water based on min(leftMax, rightMax) from the shorter side.",
          "Calculate the area between every pair of bars with nested loops in O(n^2).",
          "Sort the height array and calculate water levels with binary search.",
          "Allocate an n x n 2D grid and count empty cells."
        ],
        "answer": 0,
        "explanation": "Because trapped water is constrained by the minimum of boundary heights, moving the pointer on the lower boundary inward while updating maximums computes trapped water in O(n) time and O(1) space."
      },
      {
        "id": "cpp_11",
        "q": "Why should base class destructors be marked virtual in C++ polymorphic hierarchies?",
        "code": "class Base { public: virtual ~Base() {} };\nclass Derived : public Base { int* data; };",
        "options": [
          "To ensure the derived class destructor is invoked when deleting a derived object through a base class pointer, preventing resource leaks.",
          "To force child classes to implement pure virtual methods.",
          "To allow derived classes to be instantiated without new.",
          "To speed up compiler vtable resolution."
        ],
        "answer": 0,
        "explanation": "If a base destructor is not virtual, deleting a Derived instance via a Base* leads to undefined behavior where only Base's destructor executes, leaking Derived resources."
      },
      {
        "id": "cpp_12",
        "q": "What is the difference between constexpr and const in C++?",
        "options": [
          "constexpr variables and functions must be capable of evaluation at compile-time; const only specifies immutability at runtime.",
          "const is evaluated at compile-time; constexpr is evaluated only at runtime.",
          "constexpr is only allowed for integer types.",
          "They are identical keywords introduced for backwards compatibility."
        ],
        "answer": 0,
        "explanation": "const promises that a variable will not be modified after initialization, while constexpr strictly requires computation during compilation whenever arguments are compile-time constants."
      }
    ]
  },
  "prog_rust": {
    "title": "Rust Systems & Memory",
    "icon": "🦀",
    "questions": [
      {
        "id": "rust_1",
        "q": "What is the fundamental rule of Rust references and borrowing?",
        "options": [
          "You may have any number of immutable references (&T), OR exactly one mutable reference (&mut T), but not both simultaneously.",
          "You can have unlimited mutable references if running in release mode.",
          "Mutable references can outlive the owner.",
          "References are automatically freed by reference counting."
        ],
        "answer": 0,
        "explanation": "Rust's aliasing XOR mutability rule ensures data race freedom at compile time: either shared read-only access or single exclusive write access."
      },
      {
        "id": "rust_2",
        "q": "What happens when you assign a non-Copy type like String to another variable in Rust?",
        "code": "let s1 = String::from(\"grind\");\nlet s2 = s1;\nprintln!(\"{}\", s1);",
        "options": [
          "Compile error: borrow of moved value 's1'.",
          "Prints 'grind' because it deep-clones automatically.",
          "s1 and s2 both point to the same memory and double-free on exit.",
          "Prints empty string."
        ],
        "answer": 0,
        "explanation": "In Rust, assignment transfers ownership ('moves'). After 'let s2 = s1;', s1 is invalidated, and attempting to read it causes a compile-time error."
      },
      {
        "id": "rust_3",
        "q": "What does the '?' operator do in Rust when applied to a Result<T, E>?",
        "options": [
          "Unwraps Ok(T) on success, or returns early with Err(E) from the current function.",
          "Throws a panic if the result is an error.",
          "Retries the function up to 3 times.",
          "Converts the Result into an Option."
        ],
        "answer": 0,
        "explanation": "The '?' operator is concise error propagation: if Ok(val), it unpacks val; if Err(e), it returns Err(From::from(e)) from the enclosing function."
      },
      {
        "id": "rust_4",
        "q": "What is the difference between Rc<T> and Arc<T> in Rust?",
        "options": [
          "Arc<T> uses atomic operations and is thread-safe (Send/Sync); Rc<T> is non-atomic and single-threaded only.",
          "Rc<T> is thread-safe; Arc<T> is single-threaded.",
          "Rc<T> allocates on the stack; Arc<T> allocates on the heap.",
          "They are completely interchangeable aliases."
        ],
        "answer": 0,
        "explanation": "Arc stands for Atomically Reference Counted. Its counter uses CPU atomic primitives, allowing safe sharing across threads with slight overhead compared to Rc."
      },
      {
        "id": "rust_5",
        "q": "What is the key principle of the Borrow Checker in Rust regarding references?",
        "options": [
          "You can have any number of immutable references (&T) OR exactly one mutable reference (&mut T) at any given time, but not both.",
          "You can have unlimited mutable references as long as they are on separate threads.",
          "Mutable references can coexist with immutable references if unsafe block is not used.",
          "Borrowing is checked at runtime with an internal reference counter."
        ],
        "answer": 0,
        "explanation": "Rust's borrow checker eliminates data races and iterator invalidation at compile time by strictly enforcing the aliasing XOR mutability rule."
      },
      {
        "id": "rust_6",
        "q": "What does the 'unwrap()' method do on an Option<T> or Result<T, E> in Rust?",
        "options": [
          "Returns the inner value if Some/Ok, or causes the thread to panic! if None/Err.",
          "Returns null safely if None without terminating.",
          "Automatically retries the operation up to 3 times.",
          "Converts an Err into an empty string."
        ],
        "answer": 0,
        "explanation": "unwrap() extracts the contained value, but panics and crashes the current thread if the variant is None or Err."
      },
      {
        "id": "rust_7",
        "q": "What is the difference between String and &str in Rust?",
        "options": [
          "String is an owned, heap-allocated, growable UTF-8 buffer; &str is an immutable borrowed string slice pointing to existing bytes.",
          "&str is allocated on heap; String is stored in CPU registers.",
          "String is UTF-16 while &str is ASCII.",
          "They are identical types with different syntax sugar."
        ],
        "answer": 0,
        "explanation": "String owns its buffer on the heap (with pointer, capacity, and length). &str is a fat pointer (pointer and length) referencing a sequence of UTF-8 bytes elsewhere."
      },
      {
        "id": "rust_8",
        "q": "What is the role of the 'Drop' trait in Rust?",
        "options": [
          "It defines custom cleanup code that runs deterministically when a value goes out of scope (similar to C++ destructors).",
          "It flags memory to be collected by the background garbage collector.",
          "It drops packets in network sockets when congested.",
          "It forces an object to remain in memory permanently."
        ],
        "answer": 0,
        "explanation": "The Drop trait specifies destructor logic via 'drop(&mut self)', ensuring deterministic resource deallocation when an owner leaves scope."
      },
      {
        "id": "rust_9",
        "q": "What does the '?' operator do when used on a Result in Rust?",
        "code": "let file = File::open(\"data.txt\")?;",
        "options": [
          "Unwraps Ok(val), or early-returns Err(from(err)) from the enclosing function.",
          "Checks whether the file is null and prompts the user.",
          "Swallows the error silently and returns a default value.",
          "Spawns an async task to handle the error."
        ],
        "answer": 0,
        "explanation": "The '?' operator simplifies error propagation: if Ok, it yields the inner value; if Err, it performs From::from conversion and returns early from the current function."
      },
      {
        "id": "rust_10",
        "q": "In Rust, what does 'Arc<Mutex<T>>' enable across multiple threads?",
        "options": [
          "Atomic Reference Counting (Arc) for shared multi-thread ownership combined with Mutex for mutually exclusive thread-safe mutation.",
          "Asynchronous non-blocking file streaming without locks.",
          "Lock-free single-threaded pointer aliasing.",
          "Compiling code directly into GPU shaders."
        ],
        "answer": 0,
        "explanation": "Arc<T> allows multiple threads to safely share ownership of memory, and Mutex<T> ensures only one thread can borrow the inner data mutably at a time."
      },
      {
        "id": "rust_11",
        "q": "In LeetCode 'LRU Cache' implemented in Rust, which standard data structures or patterns are typically used?",
        "options": [
          "A HashMap mapping keys to pointers in a doubly-linked list, or std::collections with RefCell/unsafe.",
          "A simple Vec with linear scan search.",
          "A single BTreeMap sorted by key value.",
          "A recursive binary tree without hash mapping."
        ],
        "answer": 0,
        "explanation": "LRU Cache requires O(1) get and put. A doubly linked list provides O(1) node removal and insertion at head, while a HashMap enables O(1) key lookups."
      },
      {
        "id": "rust_12",
        "q": "What does the 'Send' and 'Sync' auto traits denote in Rust's concurrency model?",
        "options": [
          "Send indicates ownership can be transferred across thread boundaries; Sync indicates it is safe to share references between multiple threads (&T is Send).",
          "Send is for TCP packets; Sync is for database transactions.",
          "Send requires Mutex; Sync requires Channels.",
          "They disable compiler data race checks."
        ],
        "answer": 0,
        "explanation": "Send means an object can be moved to another thread. Sync means &T can be accessed concurrently by multiple threads without data races."
      }
    ]
  },
  "prog_kotlin": {
    "title": "Kotlin & Coroutines",
    "icon": "🎯",
    "questions": [
      {
        "id": "kt_1",
        "q": "How does Kotlin eliminate NullPointerExceptions at compile time?",
        "options": [
          "By distinguishing nullable types (String?) from non-nullable types (String) in its type system.",
          "By converting all null values into empty strings automatically.",
          "By wrapping all code in hidden try-catch blocks.",
          "By disallowing null values anywhere in the language."
        ],
        "answer": 0,
        "explanation": "Kotlin's type system makes types non-nullable by default. You must explicitly append '?' to allow nulls, forcing safe calls (?.) or elvis operators (?:)."
      },
      {
        "id": "kt_2",
        "q": "What does the 'suspend' keyword signify on a Kotlin function?",
        "options": [
          "The function can pause execution without blocking the underlying thread, and resume later.",
          "The function runs on a separate OS background daemon thread.",
          "The function cannot return any value (Unit only).",
          "The function terminates the calling process."
        ],
        "answer": 0,
        "explanation": "Suspend functions are the foundation of Kotlin Coroutines. They can yield control at suspension points without tying up the calling thread."
      },
      {
        "id": "kt_3",
        "q": "What methods are automatically synthesized for a Kotlin 'data class'?",
        "options": [
          "equals(), hashCode(), toString(), copy(), and componentN() destructuring functions.",
          "Only getters and setters.",
          "Only JSON serialization methods.",
          "Thread synchronization locks."
        ],
        "answer": 0,
        "explanation": "The compiler automatically derives structural equals/hashCode, a human-readable toString, copy() for immutable transformations, and component functions for destructuring."
      },
      {
        "id": "kt_4",
        "q": "What is Kotlin's Null Safety system and what does '?.' (safe call) and '?:' (elvis operator) do?",
        "options": [
          "Safe call '?.' executes only if the reference is non-null; Elvis '?:' provides a default fallback value if null.",
          "Safe call throws NullPointerException; Elvis catches the exception.",
          "They are bitwise shift operators.",
          "They convert objects to JSON strings."
        ],
        "answer": 0,
        "explanation": "Kotlin types distinguish nullable (T?) and non-nullable (T) at compile-time. 'a?.b' returns null if 'a' is null, and 'a ?: fallback' provides a fallback when 'a' is null."
      },
      {
        "id": "kt_5",
        "q": "What makes Kotlin Coroutines lightweight compared to traditional Java threads?",
        "options": [
          "Coroutines are cooperatively suspended without blocking underlying OS threads, allowing tens of thousands to run on a small thread pool.",
          "Coroutines run on the GPU instead of the CPU.",
          "Coroutines bypass JVM bytecode and compile to raw machine code.",
          "Coroutines disable garbage collection during execution."
        ],
        "answer": 0,
        "explanation": "Coroutines represent suspendable computations. Instead of blocking an OS thread (which takes ~1MB stack memory), coroutine suspension saves state into a lightweight heap object."
      },
      {
        "id": "kt_6",
        "q": "What does the 'data class' keyword automatically generate in Kotlin?",
        "code": "data class User(val id: Int, val name: String)",
        "options": [
          "equals(), hashCode(), toString(), copy(), and componentN() destructuring functions based on primary constructor properties.",
          "Database SQL schema migrations.",
          "REST API endpoints and serialization controllers.",
          "A singleton instance with private constructor."
        ],
        "answer": 0,
        "explanation": "Kotlin data classes automatically derive boilerplate methods: equals(), hashCode(), toString(), copy(), and positional componentN() functions for destructuring."
      },
      {
        "id": "kt_7",
        "q": "What is the difference between 'val' and 'var' in Kotlin?",
        "options": [
          "'val' declares a read-only variable (immutable reference assigned once); 'var' declares a mutable variable.",
          "'val' is static; 'var' is an instance variable.",
          "'var' is thread-safe; 'val' is not thread-safe.",
          "They are aliases with identical behavior."
        ],
        "answer": 0,
        "explanation": "'val' corresponds to Java's 'final' variable (cannot be reassigned after initialization), whereas 'var' can be reassigned freely."
      },
      {
        "id": "kt_8",
        "q": "How does Kotlin's 'extension function' feature work under the hood in JVM bytecode?",
        "code": "fun String.isGrind(): Boolean = this.contains(\"grind\")",
        "options": [
          "It compiles to a static method where the receiver object is passed as the first parameter.",
          "It modifies the Java String bytecode dynamically at runtime using classloader agents.",
          "It creates a subclass of the target class via reflection.",
          "It replaces the standard Java Virtual Machine with a Kotlin runtime."
        ],
        "answer": 0,
        "explanation": "Extension functions are resolved statically: 'fun String.isGrind()' compiles to 'public static final boolean isGrind(String $this)'."
      },
      {
        "id": "kt_9",
        "q": "What is the difference between 'launch' and 'async' coroutine builders in Kotlin?",
        "options": [
          "'launch' returns a Job (fire-and-forget without a result); 'async' returns a Deferred<T> which yields a result via .await().",
          "'launch' is synchronous; 'async' is asynchronous.",
          "'async' blocks the main UI thread; 'launch' does not.",
          "'launch' is only for Android; 'async' is for backend."
        ],
        "answer": 0,
        "explanation": "launch launches a coroutine without blocking or expecting a result (returns Job). async returns a Deferred<T> (a light promise) where calling .await() retrieves the computed value."
      },
      {
        "id": "kt_10",
        "q": "In LeetCode 'Top K Frequent Elements' in Kotlin, what is an idiomatic and optimal approach?",
        "options": [
          "Count frequencies using groupingBy { it }.eachCount(), then use a Min-Heap (PriorityQueue) of size K in O(n log k) time.",
          "Sort the entire array K times using bubble sort in O(k * n^2).",
          "Convert elements to strings and sort alphabetically.",
          "Run an exhaustive brute force search over all subsets."
        ],
        "answer": 0,
        "explanation": "groupingBy { it }.eachCount() builds the frequency map in O(n). Inserting into a min-heap bounded at capacity k extracts the top k elements in O(n log k)."
      },
      {
        "id": "kt_11",
        "q": "What is a 'sealed class' in Kotlin and how does it enhance 'when' expressions?",
        "options": [
          "It represents restricted class hierarchies where all direct subclasses are known at compile-time, allowing exhaustive 'when' statements without an 'else' branch.",
          "It encrypts class bytecode to prevent reverse engineering.",
          "It prevents inheritance completely like final classes in Java.",
          "It restricts class instantiation to a single thread."
        ],
        "answer": 0,
        "explanation": "Sealed classes restrict subclassing to the same package/module. Because the compiler knows all possible subclasses, 'when' expressions can be proven exhaustive without requiring a fallback 'else'."
      },
      {
        "id": "kt_12",
        "q": "What does the 'inline' keyword with 'reified' type parameters allow in Kotlin?",
        "code": "inline fun <reified T> printType() { println(T::class.java) }",
        "options": [
          "It preserves the generic type parameter T at runtime by inlining the function body at call sites, bypassing JVM type erasure.",
          "It forces the method to run in CPU hardware cache.",
          "It creates an interface proxy dynamically.",
          "It compiles the generic type into an Object array."
        ],
        "answer": 0,
        "explanation": "Normally JVM type erasure removes generic parameters at runtime. By inlining the function bytecode, reified parameters substitute the actual class token directly at call sites."
      }
    ]
  },
  "prog_react": {
    "title": "React & Modern Hooks",
    "icon": "⚛️",
    "questions": [
      {
        "id": "react_1",
        "q": "Why must dependencies be accurately listed in the useEffect dependency array in React?",
        "options": [
          "To prevent stale closures and ensure the effect re-runs when referenced state/props change.",
          "To compile JSX into plain HTML strings.",
          "To prevent other components from unmounting.",
          "To trigger garbage collection on old DOM nodes."
        ],
        "answer": 0,
        "explanation": "Omitting dependencies causes the effect closure to capture outdated state or props from prior renders, leading to subtle out-of-sync bugs."
      },
      {
        "id": "react_2",
        "q": "What is the primary difference between useMemo and useCallback?",
        "options": [
          "useMemo memoizes the computed value of a function; useCallback memoizes the function reference itself.",
          "useCallback memoizes computed values; useMemo memoizes DOM nodes.",
          "useMemo is asynchronous, while useCallback is synchronous.",
          "There is no difference; they are exact aliases."
        ],
        "answer": 0,
        "explanation": "useMemo(() => compute(), [deps]) caches the calculation result. useCallback(fn, [deps]) caches the function instance itself to prevent child re-renders."
      },
      {
        "id": "react_3",
        "q": "Why is using array index as the 'key' prop discouraged for dynamic lists in React?",
        "options": [
          "It can cause incorrect component state and visual bugs when items are reordered, inserted, or deleted.",
          "It throws a fatal compile-time syntax error.",
          "It increases memory usage by 10x.",
          "It converts keys to string symbols."
        ],
        "answer": 0,
        "explanation": "React uses keys to identify which items have changed, moved, or been removed. When indexes shift, React mismatches component instances and state."
      },
      {
        "id": "react_4",
        "q": "How does the useRef hook differ from useState in React?",
        "options": [
          "Updating a ref's .current value does NOT trigger a component re-render, whereas setState schedules a re-render.",
          "useRef can only store HTML DOM elements.",
          "useState does not preserve state across renders.",
          "useRef is deprecated in React 18+."
        ],
        "answer": 0,
        "explanation": "useRef provides a persistent mutable container across renders without causing the component function to re-execute on mutation."
      },
      {
        "id": "react_5",
        "q": "What is the purpose of the 'useEffect' cleanup function in React?",
        "code": "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);",
        "options": [
          "To clean up side effects (e.g., unsubscribing listeners, clearing timers) before component unmount or before re-running the effect.",
          "To clear browser memory cache and cookies.",
          "To reset the component's state variables back to initial values.",
          "To force the browser to reload the page."
        ],
        "answer": 0,
        "explanation": "Returning a function from useEffect schedules cleanup. React calls this cleanup function when the component unmounts or before re-executing the effect when dependencies change."
      },
      {
        "id": "react_6",
        "q": "What is the difference between 'useMemo' and 'useCallback' in React?",
        "options": [
          "'useMemo' memoizes the computed result value of a function; 'useCallback' memoizes the function definition itself between renders.",
          "'useCallback' runs asynchronously on web workers; 'useMemo' runs synchronously.",
          "'useMemo' is for DOM elements; 'useCallback' is for state variables.",
          "They are identical aliases in React 18."
        ],
        "answer": 0,
        "explanation": "useMemo(() => computeValue(a, b), [a, b]) caches the returned value, while useCallback(fn, deps) caches the function reference to prevent unnecessary child re-renders."
      },
      {
        "id": "react_7",
        "q": "Why should you never mutate state directly in React (e.g., 'state.count = 5')?",
        "options": [
          "React uses shallow reference equality (Object.is) to detect state changes; direct mutation doesn't change object reference and won't trigger re-renders.",
          "Direct mutation throws an immediate JavaScript SyntaxError.",
          "Direct mutation corrupts the HTML5 canvas renderer.",
          "Direct mutation disables all CSS transitions on the page."
        ],
        "answer": 0,
        "explanation": "React relies on immutable state updates. If you mutate state directly, the object reference remains the same, so React's reconciliation algorithm skips re-rendering."
      },
      {
        "id": "react_8",
        "q": "What problem does the 'React.memo' Higher-Order Component solve?",
        "options": [
          "It skips re-rendering a component if its props have not changed (shallow prop comparison).",
          "It caches database queries on the client side.",
          "It converts functional components into class components.",
          "It automatically adds error boundaries to all children."
        ],
        "answer": 0,
        "explanation": "React.memo is a performance optimization that wraps a component to memoize its rendered output, skipping re-renders when incoming props are shallowly identical."
      },
      {
        "id": "react_9",
        "q": "What is the Virtual DOM in React and why does React use Reconciliation?",
        "options": [
          "An in-memory lightweight representation of the real DOM used to compute minimum necessary DOM changes via a diffing algorithm.",
          "A 3D WebGL canvas that mimics the browser window.",
          "A shadow copy of the backend database in LocalStorage.",
          "A browser extension that speeds up network requests."
        ],
        "answer": 0,
        "explanation": "Direct DOM operations are slow. React keeps a Virtual DOM tree, computes diffs when state changes, and batches minimal updates to the real browser DOM via its Fiber reconciler."
      },
      {
        "id": "react_10",
        "q": "What are the rules of Hooks in React?",
        "options": [
          "Only call hooks at the top level of React functions (not inside loops, conditions, or nested functions), and only from React components or custom hooks.",
          "Hooks must always return a Promise and be prefixed with 'async'.",
          "Hooks must only be used in class components with constructor binding.",
          "Hooks cannot accept parameters."
        ],
        "answer": 0,
        "explanation": "React relies on the call order of hooks across renders to preserve state. Calling hooks conditionally or inside loops disrupts this fixed order and corrupts state mapping."
      },
      {
        "id": "react_11",
        "q": "In LeetCode / React system design, how do you handle Debouncing for a search input?",
        "options": [
          "Use a timer inside useEffect or custom hook to delay API calls until the user stops typing for a designated delay window (e.g., 300ms).",
          "Make an API request on every single keystroke synchronously.",
          "Store each character in localStorage before sending requests.",
          "Block the user keyboard input until the previous API response returns."
        ],
        "answer": 0,
        "explanation": "Debouncing postpones function execution until after a specified interval has elapsed since the last event, preventing overwhelming API servers with every single keypress."
      },
      {
        "id": "react_12",
        "q": "What does 'useRef' provide beyond holding references to DOM elements?",
        "options": [
          "It provides a persistent mutable container whose '.current' property survives re-renders without triggering a re-render when mutated.",
          "It triggers an immediate synchronous re-render when its value changes.",
          "It synchronizes state across multiple browser tabs automatically.",
          "It encrypts sensitive form passwords."
        ],
        "answer": 0,
        "explanation": "useRef returns a plain JavaScript object with a .current property that persists across the full lifecycle of the component. Changing .current does not cause a re-render."
      }
    ]
  },
  "math_calculus": {
    "title": "Calculus & Analysis",
    "icon": "∫",
    "questions": [
      {
        "id": "calc_1",
        "q": "What is the fundamental limit: lim (x -> 0) [sin(x) / x]?",
        "options": [
          "1",
          "0",
          "Infinity",
          "Undefined"
        ],
        "answer": 0,
        "explanation": "Using the geometric squeeze theorem or L'Hôpital's Rule (cos(0)/1), the limit of sin(x)/x as x approaches 0 equals 1."
      },
      {
        "id": "calc_2",
        "q": "What is the derivative of f(x) = e^(x^2) with respect to x?",
        "options": [
          "2x * e^(x^2)",
          "e^(x^2)",
          "x^2 * e^(x^2 - 1)",
          "2 * e^(x^2)"
        ],
        "answer": 0,
        "explanation": "By the Chain Rule: d/dx[e^u] = e^u * du/dx. Here u = x^2, du/dx = 2x, giving 2x * e^(x^2)."
      },
      {
        "id": "calc_3",
        "q": "What is the definite integral: ∫ [1 / (1 + x^2)] dx?",
        "options": [
          "arctan(x) + C",
          "ln(1 + x^2) + C",
          "arcsin(x) + C",
          "1 / (2x) + C"
        ],
        "answer": 0,
        "explanation": "The standard antiderivative of 1/(1+x^2) is the inverse tangent function, arctan(x) + C."
      },
      {
        "id": "calc_4",
        "q": "Under what conditions can L'Hôpital's Rule be applied to evaluate a limit?",
        "options": [
          "When direct substitution yields an indeterminate form like 0/0 or ±∞/±∞.",
          "Whenever the numerator is a polynomial.",
          "Only when evaluating limits as x approaches infinity.",
          "Whenever the derivative of the denominator is constant."
        ],
        "answer": 0,
        "explanation": "L'Hôpital's Rule requires the limit to produce the indeterminate form 0/0 or ±∞/±∞ and that the derivatives are continuous and exist near the point."
      },
      {
        "id": "calc_5",
        "q": "What is the derivative of f(x) = ln(x) with respect to x?",
        "options": [
          "1 / x",
          "1 / (x^2)",
          "e^x",
          "x * ln(x)"
        ],
        "answer": 0,
        "explanation": "The derivative of the natural logarithm ln(x) is 1/x for all x > 0."
      },
      {
        "id": "calc_6",
        "q": "What is the value of: lim (x -> ∞) [ (1 + 1/x)^x ]?",
        "options": [
          "e (Euler's number ≈ 2.718)",
          "1",
          "Infinity",
          "0"
        ],
        "answer": 0,
        "explanation": "This is the classic compound-interest definition of Euler's constant e."
      },
      {
        "id": "calc_7",
        "q": "What is the condition for a function f(x) to have an inflection point at x = c?",
        "options": [
          "f''(c) = 0 or is undefined, and f''(x) changes sign across c.",
          "f'(c) = 0 only.",
          "f(c) = 0 only.",
          "f'(x) is strictly negative."
        ],
        "answer": 0,
        "explanation": "An inflection point occurs where concavity changes, meaning the second derivative f''(x) switches sign (positive to negative or vice versa)."
      },
      {
        "id": "calc_8",
        "q": "What is the integral ∫ ln(x) dx evaluated using integration by parts?",
        "options": [
          "x * ln(x) - x + C",
          "1/x + C",
          "x^2 / 2 * ln(x) + C",
          "(ln(x))^2 / 2 + C"
        ],
        "answer": 0,
        "explanation": "Using ∫ u dv = uv - ∫ v du with u = ln(x), dv = dx: uv = x*ln(x), ∫ v du = ∫ x*(1/x) dx = x, giving x*ln(x) - x + C."
      },
      {
        "id": "calc_9",
        "q": "What is the derivative of f(x) = ln(x^2 + 1)?",
        "options": [
          "2x / (x^2 + 1)",
          "1 / (x^2 + 1)",
          "2 / (x^2 + 1)",
          "2x * ln(x^2 + 1)"
        ],
        "answer": 0,
        "explanation": "By the Chain Rule: d/dx[ln(u)] = (1/u) * u'. Here u = x^2 + 1 and u' = 2x, so the derivative is 2x / (x^2 + 1)."
      },
      {
        "id": "calc_10",
        "q": "What does the Mean Value Theorem (MVT) state for a continuous function on [a, b] differentiable on (a, b)?",
        "options": [
          "There exists at least one c in (a, b) such that f'(c) = [f(b) - f(a)] / (b - a).",
          "f'(x) must be zero everywhere in the interval.",
          "f(a) must equal f(b) for all functions.",
          "The integral of f(x) over [a, b] must equal zero."
        ],
        "answer": 0,
        "explanation": "The Mean Value Theorem guarantees that there is at least one point c where the instantaneous rate of change (derivative) equals the average rate of change over the interval."
      },
      {
        "id": "calc_11",
        "q": "What is the integral of e^(2x) with respect to x?",
        "options": [
          "(1/2) e^(2x) + C",
          "2 e^(2x) + C",
          "e^(2x) + C",
          "(1/4) e^(2x) + C"
        ],
        "answer": 0,
        "explanation": "Using substitution u = 2x, du = 2 dx -> dx = du/2. Thus ∫ e^(2x) dx = (1/2) e^(2x) + C."
      },
      {
        "id": "calc_12",
        "q": "In optimization problems, if f''(c) > 0 at a critical point where f'(c) = 0, what does the Second Derivative Test indicate?",
        "options": [
          "f(x) has a local minimum at x = c.",
          "f(x) has a local maximum at x = c.",
          "The test is inconclusive.",
          "x = c is a point of inflection."
        ],
        "answer": 0,
        "explanation": "When f'(c) = 0 and f''(c) > 0, the curve is concave upward (∪), which guarantees a local minimum at x = c."
      }
    ]
  },
  "math_linear_algebra": {
    "title": "Linear Algebra & Vectors",
    "icon": "🔢",
    "questions": [
      {
        "id": "la_1",
        "q": "What is the determinant of the 2x2 matrix [[a, b], [c, d]]?",
        "options": [
          "ad - bc",
          "ab - cd",
          "ac - bd",
          "ad + bc"
        ],
        "answer": 0,
        "explanation": "The determinant of a 2x2 matrix is computed by multiplying the main diagonal elements and subtracting the product of the off-diagonal elements: ad - bc."
      },
      {
        "id": "la_2",
        "q": "What is the necessary and sufficient condition for a square matrix A to be invertible?",
        "options": [
          "det(A) ≠ 0 (determinant is non-zero).",
          "All entries of A must be positive.",
          "A must be a diagonal matrix.",
          "The trace of A must equal 0."
        ],
        "answer": 0,
        "explanation": "A square matrix is invertible (non-singular) if and only if its determinant is non-zero, meaning its columns are linearly independent and full rank."
      },
      {
        "id": "la_3",
        "q": "If λ is an eigenvalue of matrix A with corresponding eigenvector v, which equation holds?",
        "options": [
          "A * v = λ * v",
          "A * v = v / λ",
          "A + v = λ",
          "det(A) = λ * v"
        ],
        "answer": 0,
        "explanation": "By definition, an eigenvector v under linear transformation A is only scaled by scalar factor λ: Av = λv."
      },
      {
        "id": "la_4",
        "q": "What does the Rank-Nullity Theorem state for an m x n matrix A?",
        "options": [
          "Rank(A) + Nullity(A) = n (number of columns).",
          "Rank(A) * Nullity(A) = m.",
          "Rank(A) - Nullity(A) = 0.",
          "Rank(A) + Nullity(A) = m + n."
        ],
        "answer": 0,
        "explanation": "The Rank-Nullity Theorem states that the dimension of the column space (Rank) plus the dimension of the null space (Nullity) equals the total dimension of the domain (n)."
      },
      {
        "id": "la_5",
        "q": "What is the dot product of two non-zero perpendicular (orthogonal) vectors in R^n?",
        "options": [
          "0",
          "1",
          "-1",
          "Equal to the product of their lengths."
        ],
        "answer": 0,
        "explanation": "The dot product u · v = ||u|| ||v|| cos(θ). When vectors are perpendicular, θ = 90° and cos(90°) = 0, so the dot product is 0."
      },
      {
        "id": "la_6",
        "q": "For any two invertible matrices A and B, what is the inverse of their product (AB)^(-1)?",
        "options": [
          "B^(-1) * A^(-1)",
          "A^(-1) * B^(-1)",
          "(BA)^(-1)",
          "A^(-1) + B^(-1)"
        ],
        "answer": 0,
        "explanation": "The order of multiplication reverses when taking the inverse of a product: (AB)^(-1) = B^(-1) * A^(-1)."
      },
      {
        "id": "la_7",
        "q": "What is an orthogonal matrix Q defined by?",
        "options": [
          "Q^T * Q = I (its transpose equals its inverse).",
          "Q = -Q^T.",
          "det(Q) = 0.",
          "All elements are equal to 1."
        ],
        "answer": 0,
        "explanation": "An orthogonal matrix has orthonormal columns, meaning Q^T * Q = I, so Q^(-1) = Q^T."
      },
      {
        "id": "la_8",
        "q": "What are the eigenvalues of a diagonal or triangular matrix?",
        "options": [
          "The entries along the main diagonal.",
          "The sum of all entries in each row.",
          "The reciprocal of the determinant.",
          "They are always equal to 1 or 0."
        ],
        "answer": 0,
        "explanation": "For any diagonal or triangular matrix, det(A - λI) is simply the product of (a_ii - λ) across the diagonal, making the diagonal entries precisely the eigenvalues."
      },
      {
        "id": "la_9",
        "q": "What does it mean if the dot product of two non-zero vectors in R^n is zero?",
        "options": [
          "The two vectors are orthogonal (perpendicular) to each other.",
          "The two vectors are linearly dependent and parallel.",
          "One of the vectors must be the zero vector.",
          "Their cross product is also zero."
        ],
        "answer": 0,
        "explanation": "u · v = ||u|| ||v|| cos(θ). If u · v = 0 for non-zero vectors, cos(θ) = 0, which means the angle θ is 90 degrees (orthogonal)."
      },
      {
        "id": "la_10",
        "q": "According to the Rank-Nullity Theorem for an m x n matrix A, what is the relationship between rank and nullity?",
        "options": [
          "rank(A) + nullity(A) = n (number of columns)",
          "rank(A) * nullity(A) = m (number of rows)",
          "rank(A) - nullity(A) = 0",
          "rank(A) + nullity(A) = det(A)"
        ],
        "answer": 0,
        "explanation": "The Rank-Nullity Theorem states that the dimension of the column space (rank) plus the dimension of the null space (nullity) equals the total dimension of the domain (n columns)."
      },
      {
        "id": "la_11",
        "q": "What is an orthogonal matrix Q defined as?",
        "options": [
          "A square invertible matrix whose transpose equals its inverse: Q^T Q = Q Q^T = I.",
          "A matrix where all entries are equal to 0 except one.",
          "A matrix whose determinant is always zero.",
          "A matrix with all positive eigenvalues."
        ],
        "answer": 0,
        "explanation": "An orthogonal matrix has orthonormal columns and rows, satisfying Q^T = Q^(-1), preserving vector lengths and angles under transformation."
      },
      {
        "id": "la_12",
        "q": "In Machine Learning / PCA, what does Singular Value Decomposition (SVD) decompose matrix A into?",
        "options": [
          "A = U Σ V^T, where U and V are orthogonal matrices and Σ contains singular values.",
          "A = L U, lower and upper triangular matrices.",
          "A = Q R, orthogonal matrix Q and upper triangular R.",
          "A = P D P^(-1), where D is a diagonal matrix."
        ],
        "answer": 0,
        "explanation": "SVD decomposes any m x n matrix into A = U Σ V^T, where singular values in Σ represent variance along principal component directions."
      }
    ]
  },
  "math_prob_stats": {
    "title": "Probability & Statistics",
    "icon": "📊",
    "questions": [
      {
        "id": "ps_1",
        "q": "What is Bayes' Theorem for conditional probability P(A | B)?",
        "options": [
          "P(A | B) = [P(B | A) * P(A)] / P(B)",
          "P(A | B) = P(A) * P(B)",
          "P(A | B) = [P(A) + P(B)] / P(A ∩ B)",
          "P(A | B) = P(B | A) / P(A)"
        ],
        "answer": 0,
        "explanation": "Bayes' Theorem updates the prior probability P(A) given evidence B using likelihood P(B|A) normalized by total evidence P(B)."
      },
      {
        "id": "ps_2",
        "q": "What is the expected value (mean) of rolling a fair 6-sided die?",
        "options": [
          "3.5",
          "3.0",
          "4.0",
          "3.6"
        ],
        "answer": 0,
        "explanation": "E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3.5."
      },
      {
        "id": "ps_3",
        "q": "In a standard normal distribution (Gaussian), approximately what percentage of data falls within 1 standard deviation (±1σ) of the mean?",
        "options": [
          "68.2%",
          "95.4%",
          "99.7%",
          "50.0%"
        ],
        "answer": 0,
        "explanation": "According to the empirical rule (68-95-99.7 rule), approximately 68.2% of normal data lies within 1 standard deviation of the mean."
      },
      {
        "id": "ps_4",
        "q": "If two events A and B are mutually exclusive, what is P(A ∩ B)?",
        "options": [
          "0",
          "P(A) * P(B)",
          "1",
          "0.5"
        ],
        "answer": 0,
        "explanation": "Mutually exclusive events cannot happen at the same time, meaning their intersection is the empty set and P(A ∩ B) = 0."
      },
      {
        "id": "ps_5",
        "q": "What is the variance of a constant value c?",
        "options": [
          "0",
          "c",
          "c^2",
          "1"
        ],
        "answer": 0,
        "explanation": "A constant has no dispersion or variability around its mean; hence Var(c) = E[(c - c)^2] = 0."
      },
      {
        "id": "ps_6",
        "q": "What is the probability of getting at least one Head when flipping two fair coins?",
        "options": [
          "3 / 4 (75%)",
          "1 / 2 (50%)",
          "1 / 4 (25%)",
          "2 / 3 (66.7%)"
        ],
        "answer": 0,
        "explanation": "Sample space: {HH, HT, TH, TT}. Outcomes with at least one head are {HH, HT, TH} = 3 out of 4 (75%)."
      },
      {
        "id": "ps_7",
        "q": "What unique property characterizes the Poisson distribution with parameter λ?",
        "options": [
          "Mean equals Variance (Mean = Var = λ).",
          "Mean is always greater than Variance.",
          "Variance is always 0.",
          "It has a bell-shaped continuous density."
        ],
        "answer": 0,
        "explanation": "In a Poisson process, both the expected value E[X] and the variance Var(X) are identically equal to parameter λ."
      },
      {
        "id": "ps_8",
        "q": "What is Bayes' Theorem formula for conditional probability P(A|B)?",
        "options": [
          "P(A|B) = [P(B|A) * P(A)] / P(B)",
          "P(A|B) = P(A) * P(B)",
          "P(A|B) = P(A ∩ B) * P(B)",
          "P(A|B) = [P(A) + P(B)] / P(A ∩ B)"
        ],
        "answer": 0,
        "explanation": "Bayes' Theorem updates the prior probability P(A) given evidence B using likelihood P(B|A) and marginal likelihood P(B): P(A|B) = [P(B|A) P(A)] / P(B)."
      },
      {
        "id": "ps_9",
        "q": "What is the relationship between Variance and Standard Deviation (σ)?",
        "options": [
          "Variance = σ^2 (Standard Deviation squared)",
          "Variance = √σ",
          "Variance = 2 * σ",
          "Variance = 1 / σ"
        ],
        "answer": 0,
        "explanation": "Variance measures average squared deviations from the mean; Standard Deviation is the positive square root of the variance: Var(X) = σ^2."
      },
      {
        "id": "ps_10",
        "q": "In a Normal (Gaussian) distribution, approximately what percentage of data falls within 1 standard deviation of the mean (μ ± 1σ)?",
        "options": [
          "68.2%",
          "95.4%",
          "99.7%",
          "50.0%"
        ],
        "answer": 0,
        "explanation": "By the empirical 68-95-99.7 rule: ~68.2% lies within ±1σ, ~95.4% within ±2σ, and ~99.7% within ±3σ."
      },
      {
        "id": "ps_11",
        "q": "What is the expected value (mean) of a fair 6-sided die roll?",
        "options": [
          "3.5",
          "3.0",
          "4.0",
          "3.66"
        ],
        "answer": 0,
        "explanation": "E[X] = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3.5."
      },
      {
        "id": "ps_12",
        "q": "What does the Central Limit Theorem (CLT) state about the distribution of sample means from any population with finite variance?",
        "options": [
          "As the sample size n becomes large (typically n >= 30), the sampling distribution of the sample mean approaches a Normal distribution regardless of the population's shape.",
          "All populations become normally distributed over time.",
          "The variance of the sample increases proportionally to n.",
          "The sample median must always equal the sample mean."
        ],
        "answer": 0,
        "explanation": "The CLT is fundamental to statistics: regardless of the underlying distribution, the normalized sum or mean of a sufficiently large sample converges to a Gaussian distribution."
      }
    ]
  },
  "math_discrete": {
    "title": "Discrete Mathematics",
    "icon": "🧠",
    "questions": [
      {
        "id": "dm_1",
        "q": "According to the Handshaking Lemma, what is the sum of degrees of all vertices in an undirected graph with E edges?",
        "options": [
          "2 * E",
          "E",
          "E^2",
          "E / 2"
        ],
        "answer": 0,
        "explanation": "Every edge connects two vertices and contributes exactly 2 to the sum of degrees, making the total degree sum 2*E."
      },
      {
        "id": "dm_2",
        "q": "What does the Pigeonhole Principle state?",
        "options": [
          "If n items are put into m containers and n > m, at least one container must hold more than one item.",
          "Every graph with n vertices has at least n edges.",
          "A set with n elements has n! subsets.",
          "All planar graphs can be 3-colored."
        ],
        "answer": 0,
        "explanation": "The Pigeonhole Principle states that if more pigeons than pigeonholes are placed, at least one pigeonhole must contain multiple pigeons."
      },
      {
        "id": "dm_3",
        "q": "How many edges are in any connected tree graph with n vertices?",
        "options": [
          "n - 1",
          "n",
          "n + 1",
          "2 * n"
        ],
        "answer": 0,
        "explanation": "A tree is a connected acyclic graph. Any tree with n vertices has exactly n - 1 edges."
      },
      {
        "id": "dm_4",
        "q": "How many subsets (power set size) does a set with n distinct elements contain?",
        "options": [
          "2^n",
          "n^2",
          "n!",
          "2 * n"
        ],
        "answer": 0,
        "explanation": "Each element has 2 choices (either included or excluded in a subset), yielding 2^n total subsets."
      },
      {
        "id": "dm_5",
        "q": "Under what condition does a connected undirected graph possess an Eulerian Circuit?",
        "options": [
          "Every vertex has an even degree.",
          "All vertices have an odd degree.",
          "The graph contains no cycles.",
          "The graph has exactly two vertices with odd degree."
        ],
        "answer": 0,
        "explanation": "Euler proved that a connected graph has a closed Eulerian circuit if and only if every single vertex has an even degree."
      },
      {
        "id": "dm_6",
        "q": "In mathematical logic, if proposition P is False, what is the truth value of the implication: P → Q?",
        "options": [
          "Always True (Vacuous Truth)",
          "Always False",
          "Depends on Q",
          "Undefined"
        ],
        "answer": 0,
        "explanation": "An implication P → Q is False only when P is True and Q is False. When premise P is False, the statement is vacuously True."
      },
      {
        "id": "dm_7",
        "q": "What is Euler's Formula for any connected planar graph with V vertices, E edges, and F faces?",
        "options": [
          "V - E + F = 2",
          "V + E + F = 2",
          "V - E - F = 0",
          "E = 2V + F"
        ],
        "answer": 0,
        "explanation": "Euler's characteristic for planar graphs states: Vertices - Edges + Faces = 2."
      },
      {
        "id": "dm_8",
        "q": "What does the Pigeonhole Principle state?",
        "options": [
          "If n items are placed into m containers where n > m, at least one container must hold more than one item.",
          "Every connected graph has an even number of vertices.",
          "Every set with n elements has 2^n subsets.",
          "Prime numbers cannot be divided into equal groups."
        ],
        "answer": 0,
        "explanation": "If you have more pigeons than holes, at least one hole must contain at least two pigeons. This fundamental counting theorem is widely used in competitive programming proofs."
      },
      {
        "id": "dm_9",
        "q": "How many subsets does a set with n elements have (power set cardinality)?",
        "options": [
          "2^n",
          "n^2",
          "n!",
          "2n"
        ],
        "answer": 0,
        "explanation": "Each element has 2 choices (either included or excluded in a subset), giving 2 * 2 * ... * 2 = 2^n total subsets."
      },
      {
        "id": "dm_10",
        "q": "What is the Handshaking Lemma in Graph Theory?",
        "options": [
          "The sum of degrees of all vertices in a graph equals twice the number of edges: Σ deg(v) = 2|E|.",
          "Every graph contains at least two vertices with degree zero.",
          "A bipartite graph cannot contain cycles of even length.",
          "The number of edges in a tree is equal to the number of vertices."
        ],
        "answer": 0,
        "explanation": "Each edge connects two vertices and contributes 1 to the degree count of both incident vertices, so the total sum of all vertex degrees is exactly 2 * |E|."
      },
      {
        "id": "dm_11",
        "q": "In modular arithmetic, what does Fermat's Little Theorem state for a prime p and integer a not divisible by p?",
        "options": [
          "a^(p - 1) ≡ 1 (mod p)",
          "a^p ≡ 0 (mod p)",
          "a^(p + 1) ≡ 1 (mod p)",
          "a * p ≡ a (mod p)"
        ],
        "answer": 0,
        "explanation": "Fermat's Little Theorem states that if p is prime and gcd(a, p) = 1, then a^(p-1) modulo p is 1. This forms the basis of RSA cryptography and modular inverses."
      },
      {
        "id": "dm_12",
        "q": "What is the number of edges in a tree with n vertices?",
        "options": [
          "n - 1",
          "n",
          "n + 1",
          "n(n - 1) / 2"
        ],
        "answer": 0,
        "explanation": "By definition, a tree is a connected acyclic graph. Any tree with n vertices has exactly n - 1 edges."
      }
    ]
  },
  "english_grammar": {
    "title": "Grammar & Sentence Correction",
    "icon": "📝",
    "questions": [
      {
        "id": "eng_g_1",
        "q": "Choose the grammatically correct sentence regarding subject-verb agreement with correlative conjunctions:",
        "options": [
          "Neither the teacher nor the students were present in the hall.",
          "Neither the teacher nor the students was present in the hall.",
          "Neither the teacher or the students was present in the hall.",
          "Neither the teacher nor the students is present in the hall."
        ],
        "answer": 0,
        "explanation": "With 'neither... nor', the verb agrees with the closer subject. 'Students' is plural, so 'were' is correct."
      },
      {
        "id": "eng_g_2",
        "q": "Which sentence uses the correct conditional subjunctive mood?",
        "options": [
          "If I were you, I would accept the challenge.",
          "If I was you, I would accept the challenge.",
          "If I am you, I will accepted the challenge.",
          "If I be you, I would have accepted the challenge."
        ],
        "answer": 0,
        "explanation": "In hypothetical or contrary-to-fact conditional clauses, the subjunctive mood requires 'were' regardless of whether the subject is singular (I, he, she)."
      },
      {
        "id": "eng_g_3",
        "q": "Identify the correct usage of 'fewer' versus 'less':",
        "options": [
          "There were fewer errors in the code today and less memory consumed.",
          "There were less errors in the code today and fewer memory consumed.",
          "There were fewer error in the code today and fewer memory consumed.",
          "There were less errors in the code today and less memory consumed."
        ],
        "answer": 0,
        "explanation": "'Fewer' is used for countable nouns (errors), while 'less' is used for uncountable or continuous quantities (memory, time, water)."
      },
      {
        "id": "eng_g_4",
        "q": "Complete the sentence with the correct preposition: 'He was congratulated ______ his outstanding milestone.'",
        "options": [
          "on",
          "for",
          "at",
          "about"
        ],
        "answer": 0,
        "explanation": "The standard English idiomatic preposition following 'congratulate' is 'on' ('congratulate someone on something')."
      },
      {
        "id": "eng_g_5",
        "q": "Identify the sentence that correctly avoids a dangling modifier:",
        "options": [
          "Walking into the arena, the player saw the scoreboard illuminate.",
          "Walking into the arena, the scoreboard illuminated.",
          "Having finished the task, the computer was shut down by him.",
          "Barking loudly, the mail carrier was chased by the dog."
        ],
        "answer": 0,
        "explanation": "The participle 'Walking into the arena' must logically modify the subject that follows ('the player'). The scoreboard cannot walk."
      },
      {
        "id": "eng_g_6",
        "q": "Which word correctly completes the sentence: 'The committee has arrived at ______ unanimous decision.'",
        "options": [
          "a",
          "an",
          "the other",
          "no article"
        ],
        "answer": 0,
        "explanation": "'Unanimous' begins with a consonant sound /juː/ (like 'you'), so it takes the indefinite article 'a', not 'an'."
      },
      {
        "id": "eng_7",
        "q": "Identify the grammatically correct sentence regarding subject-verb agreement with compound subjects:",
        "options": [
          "Neither the manager nor the employees were informed about the schedule change.",
          "Neither the manager nor the employees was informed about the schedule change.",
          "Neither the manager or the employees was informed about the schedule change.",
          "Neither the manager nor the employees has been informed about the schedule change."
        ],
        "answer": 0,
        "explanation": "When subjects are connected by 'neither... nor', the verb agrees with the subject closest to it. Here, 'employees' is plural, requiring the plural verb 'were'."
      },
      {
        "id": "eng_8",
        "q": "Which sentence correctly avoids a dangling modifier?",
        "options": [
          "Walking into the library, she was impressed by the towering shelves of antique books.",
          "Walking into the library, the towering shelves of antique books impressed her.",
          "Having finished the code, the laptop was closed.",
          "To succeed in exams, good study habits must be practiced."
        ],
        "answer": 0,
        "explanation": "The introductory participial phrase 'Walking into the library' must logically modify the subject that immediately follows ('she'). In the second option, it erroneously implies the shelves were walking."
      },
      {
        "id": "eng_9",
        "q": "Which sentence uses the correct subjunctive mood for expressing a hypothetical condition contrary to fact?",
        "options": [
          "If I were you, I would accept the software engineering offer immediately.",
          "If I was you, I would accept the software engineering offer immediately.",
          "If I am you, I will accept the software engineering offer immediately.",
          "If I be you, I would accept the software engineering offer immediately."
        ],
        "answer": 0,
        "explanation": "The subjunctive mood for hypothetical, unreal, or contrary-to-fact conditions uses 'were' regardless of the singular subject (e.g., 'If I were', 'If he were')."
      },
      {
        "id": "eng_10",
        "q": "Select the sentence that maintains proper parallel structure:",
        "options": [
          "The engineer loves designing algorithms, writing clean tests, and optimizing database queries.",
          "The engineer loves designing algorithms, to write clean tests, and optimizing database queries.",
          "The engineer loves to design algorithms, writing clean tests, and optimize database queries.",
          "The engineer loves designing algorithms, clean test writing, and to optimize database queries."
        ],
        "answer": 0,
        "explanation": "Parallel structure requires items in a list or comparison to take the same grammatical form. All three items ('designing', 'writing', 'optimizing') are gerund phrases."
      },
      {
        "id": "eng_11",
        "q": "What is the correct pronoun usage in: 'Between you and ____, the project deadline cannot be delayed.'?",
        "options": [
          "me",
          "I",
          "myself",
          "mine"
        ],
        "answer": 0,
        "explanation": "'Between' is a preposition. Prepositions govern objective case pronouns (me, him, her, us, them). Therefore, 'between you and me' is grammatically correct."
      },
      {
        "id": "eng_12",
        "q": "Choose the sentence that correctly distinguishes 'affect' vs 'effect':",
        "options": [
          "The new architectural policy will affect system latency, and the effect will be noticed immediately.",
          "The new architectural policy will effect system latency, and the affect will be noticed immediately.",
          "The new architectural policy will affect system latency, and the affect will be noticed immediately.",
          "The new architectural policy will effect system latency, and the effect will be noticed immediately."
        ],
        "answer": 0,
        "explanation": "'Affect' is typically a verb meaning to influence; 'effect' is typically a noun meaning the result or outcome."
      }
    ]
  },
  "english_verbal": {
    "title": "Vocabulary, Idioms & Verbal Aptitude",
    "icon": "📚",
    "questions": [
      {
        "id": "eng_v_1",
        "q": "What is the closest SYNONYM for the word 'EPHEMERAL'?",
        "options": [
          "Transient (Short-lived)",
          "Permanent",
          "Monumental",
          "Deceitful"
        ],
        "answer": 0,
        "explanation": "'Ephemeral' means lasting for a very short time; its synonym is transient or fleeting."
      },
      {
        "id": "eng_v_2",
        "q": "What is the closest ANTONYM for the word 'PRAGMATIC'?",
        "options": [
          "Idealistic / Impractical",
          "Sensible",
          "Realistic",
          "Diligent"
        ],
        "answer": 0,
        "explanation": "'Pragmatic' means dealing with things sensibly and realistically. The opposite is idealistic or visionary without practical grounding."
      },
      {
        "id": "eng_v_3",
        "q": "What does the common idiom 'Burn the midnight oil' mean?",
        "options": [
          "To work or study late into the night.",
          "To waste resources unnecessarily.",
          "To cause an explosive conflict.",
          "To travel to distant places."
        ],
        "answer": 0,
        "explanation": "'Burning the midnight oil' refers to working or studying late into the night, derived from historic oil lamps."
      },
      {
        "id": "eng_v_4",
        "q": "What is the one-word substitution for: 'A person who hates or distrusts humankind'?",
        "options": [
          "Misanthrope",
          "Philanthropist",
          "Altruist",
          "Polyglot"
        ],
        "answer": 0,
        "explanation": "A 'misanthrope' is a person who dislikes humankind and avoids human society. A 'philanthropist' is the opposite."
      },
      {
        "id": "eng_v_5",
        "q": "Complete the analogy: OARSMAN : REGATTA :: RUNNER : ______",
        "options": [
          "MARATHON",
          "TRACK",
          "STADIUM",
          "BATON"
        ],
        "answer": 0,
        "explanation": "An oarsman participates in a regatta (boat race), just as a runner participates in a marathon (foot race)."
      },
      {
        "id": "eng_v_6",
        "q": "What does the word 'UBIQUITOUS' mean?",
        "options": [
          "Present, appearing, or found everywhere.",
          "Extremely rare and secluded.",
          "Hazardous to health.",
          "Lacking clear shape."
        ],
        "answer": 0,
        "explanation": "'Ubiquitous' means omnipresent or existing everywhere at once (e.g., 'smartphones have become ubiquitous')."
      },
      {
        "id": "verb_7",
        "q": "What is the meaning of the word 'EPHEMERAL'?",
        "options": [
          "Lasting for a very short time; fleeting and transient.",
          "Permanent, eternal, and everlasting.",
          "Extremely heavy and dense.",
          "Deeply mystical and spiritual."
        ],
        "answer": 0,
        "explanation": "'Ephemeral' comes from Greek 'ephemeros' (lasting a day), describing something fleeting or short-lived."
      },
      {
        "id": "verb_8",
        "q": "Complete the analogy: CANDID : DISSEMBLING :: LOQUACIOUS : ____",
        "options": [
          "RETICENT",
          "GARRULOUS",
          "VERBOSE",
          "ELOQUENT"
        ],
        "answer": 0,
        "explanation": "'Candid' (honest/forthright) is the antonym of 'dissembling' (deceiving). Similarly, 'loquacious' (talkative) is the antonym of 'reticent' (reserved/silent)."
      },
      {
        "id": "verb_9",
        "q": "What does the idiom 'to burn the midnight oil' mean?",
        "options": [
          "To work or study late into the night.",
          "To waste valuable resources carelessly.",
          "To cause an irreversible crisis.",
          "To wake up very early before sunrise."
        ],
        "answer": 0,
        "explanation": "The idiom 'burn the midnight oil' historically refers to burning oil lamps to work or study long past midnight."
      },
      {
        "id": "verb_10",
        "q": "Select the word that is nearest in meaning to 'UBIQUITOUS':",
        "options": [
          "Omnipresent (found everywhere)",
          "Rare and scarce",
          "Dangerous and hazardous",
          "Outdated and obsolete"
        ],
        "answer": 0,
        "explanation": "'Ubiquitous' means present, appearing, or found everywhere simultaneously (omnipresent)."
      },
      {
        "id": "verb_11",
        "q": "Choose the antonym for 'ALACRITY':",
        "options": [
          "Reluctance or apathy (sluggishness)",
          "Eagerness and enthusiasm",
          "Swiftness and speed",
          "Sharp mental agility"
        ],
        "answer": 0,
        "explanation": "'Alacrity' means brisk and cheerful readiness. Its antonym is reluctance, apathy, or sluggishness."
      },
      {
        "id": "verb_12",
        "q": "Which word best completes the sentence: 'The CEO gave a ____ explanation that covered all complex points concisely and effectively.'?",
        "options": [
          "cogent",
          "diffuse",
          "tenuous",
          "specious"
        ],
        "answer": 0,
        "explanation": "'Cogent' means clear, logical, and convincing. 'Specious' means superficially plausible but wrong; 'diffuse' means wordy."
      }
    ]
  },
  "reasoning_logical": {
    "title": "Logical Reasoning & Puzzles",
    "icon": "🧩",
    "questions": [
      {
        "id": "rl_1",
        "q": "Blood Relations: Pointing to a photograph, a woman says: 'His mother is the only daughter of my mother.' Who is the person in the photograph to the woman?",
        "options": [
          "Her Son",
          "Her Brother",
          "Her Husband",
          "Her Nephew"
        ],
        "answer": 0,
        "explanation": "The 'only daughter of my mother' is the woman herself. Therefore, 'his mother is myself', meaning the person is her son."
      },
      {
        "id": "rl_2",
        "q": "Direction Sense: Kabir walks 10 meters North, turns right and walks 15 meters, then turns right and walks 10 meters. How far is he from his starting point?",
        "options": [
          "15 meters East",
          "10 meters North",
          "25 meters East",
          "5 meters West"
        ],
        "answer": 0,
        "explanation": "Moving 10m North and then 10m South cancels the vertical displacement, leaving him 15 meters directly East of the starting point."
      },
      {
        "id": "rl_3",
        "q": "Syllogism: Statements:\n1. All roses are flowers.\n2. Some flowers fade quickly.\nWhich conclusion definitely follows?",
        "options": [
          "Neither conclusion definitely follows.",
          "All roses fade quickly.",
          "No roses fade quickly.",
          "Some roses are definitely not flowers."
        ],
        "answer": 0,
        "explanation": "Since only 'some' flowers fade quickly, those flowers might not overlap with roses at all. Thus neither claim follows necessarily."
      },
      {
        "id": "rl_4",
        "q": "Clocks: What is the angle between the hour hand and the minute hand of a clock at 3:30?",
        "options": [
          "75 degrees",
          "90 degrees",
          "60 degrees",
          "85 degrees"
        ],
        "answer": 0,
        "explanation": "Minute hand is at 180° (6). Hour hand at 3:30 is at 3*30° + 30*(0.5°) = 90° + 15° = 105°. Difference: 180° - 105° = 75°."
      },
      {
        "id": "rl_5",
        "q": "Calendar: If January 1st of a non-leap year falls on a Monday, what day of the week does December 31st fall on?",
        "options": [
          "Monday",
          "Tuesday",
          "Sunday",
          "Wednesday"
        ],
        "answer": 0,
        "explanation": "A standard year has 365 days = 52 weeks + 1 day. The first day and the last day of a non-leap year are always identical (Monday)."
      },
      {
        "id": "rl_6",
        "q": "Seating Puzzle: Five friends A, B, C, D, E sit in a row facing North. C sits in the middle. A sits at the extreme left. B is immediately to the right of C. Who is between A and C?",
        "options": [
          "D or E",
          "B",
          "A",
          "Nobody"
        ],
        "answer": 0,
        "explanation": "Positions 1 to 5: Pos 1 = A, Pos 3 = C, Pos 4 = B. Position 2 (between A and C) must be occupied by either D or E."
      },
      {
        "id": "logic_7",
        "q": "In a family, A is the brother of B. B is the daughter of C. D is the father of A. How is C related to D?",
        "options": [
          "C is the wife of D (mother of A and B).",
          "C is the sister of D.",
          "C is the daughter of D.",
          "Cannot be determined without additional info."
        ],
        "answer": 0,
        "explanation": "A and B are siblings (A is son, B is daughter). D is the father of A, which means D is also father of B. Since B is the daughter of C and D, C is the mother and therefore the wife of D."
      },
      {
        "id": "logic_8",
        "q": "Five friends (P, Q, R, S, T) are sitting in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the exact middle?",
        "options": [
          "S",
          "T",
          "Q",
          "R"
        ],
        "answer": 0,
        "explanation": "Ordering from left to right: P is left of T -> P, T. S is between T and Q -> P, T, S, Q. Q is immediate left of R -> P, T, S, Q, R. The exact middle person is S."
      },
      {
        "id": "logic_9",
        "q": "Statements: All cats are animals. All animals are mammals. Conclusion I: All cats are mammals. Conclusion II: Some mammals are cats.",
        "options": [
          "Both Conclusion I and II follow.",
          "Only Conclusion I follows.",
          "Only Conclusion II follows.",
          "Neither conclusion follows."
        ],
        "answer": 0,
        "explanation": "If Cats ⊆ Animals and Animals ⊆ Mammals, then Cats ⊆ Mammals (Conclusion I holds). Since the set of cats is non-empty within mammals, Some mammals are cats (Conclusion II holds)."
      },
      {
        "id": "logic_10",
        "q": "A man walks 5 km South, turns left and walks 3 km, turns left again and walks 5 km. In which direction and distance is he from his starting point?",
        "options": [
          "3 km East",
          "3 km West",
          "5 km North",
          "8 km South"
        ],
        "answer": 0,
        "explanation": "Starting at (0,0): South 5 km -> (0, -5). Left turn (facing South, left is East) 3 km -> (3, -5). Left turn (facing East, left is North) 5 km -> (3, 0). He is exactly 3 km East of the origin."
      },
      {
        "id": "logic_11",
        "q": "Pointing to a photograph, a woman says: 'He is the only son of my grandfather's only son.' How is the man in the photograph related to the woman?",
        "options": [
          "Brother",
          "Father",
          "Cousin",
          "Uncle"
        ],
        "answer": 0,
        "explanation": "'My grandfather's only son' is the woman's father. 'The only son of my father' is her brother."
      },
      {
        "id": "logic_12",
        "q": "If South-East becomes North, North-East becomes West, and so on, what will West become?",
        "options": [
          "South-East",
          "South-West",
          "North-East",
          "North-West"
        ],
        "answer": 0,
        "explanation": "South-East (135° clockwise from North) becomes North (0°), which is a 135° counter-clockwise rotation. Applying a 135° counter-clockwise rotation to West (270°) lands at 135°, which is South-East."
      }
    ]
  },
  "reasoning_analytical": {
    "title": "Analytical Aptitude & Sequences",
    "icon": "🔍",
    "questions": [
      {
        "id": "ra_1",
        "q": "Find the next number in the quadratic sequence: 2, 6, 12, 20, 30, ?",
        "options": [
          "42",
          "40",
          "36",
          "48"
        ],
        "answer": 0,
        "explanation": "Pattern is n * (n + 1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30. The next term is 6 * 7 = 42."
      },
      {
        "id": "ra_2",
        "q": "Coding-Decoding: If 'APPLE' is coded as 'BQQMF' (+1 shift), how is 'GRIND' coded in that same language?",
        "options": [
          "HSJOE",
          "HRJND",
          "FSIMC",
          "GSJOE"
        ],
        "answer": 0,
        "explanation": "Each letter shifts forward by +1: G->H, R->S, I->J, N->O, D->E. Result: HSJOE."
      },
      {
        "id": "ra_3",
        "q": "Find the missing term in the geometric series: 3, 9, 27, 81, ?",
        "options": [
          "243",
          "162",
          "324",
          "729"
        ],
        "answer": 0,
        "explanation": "Every term is multiplied by 3 (powers of 3): 3^1=3, 3^2=9, 3^3=27, 3^4=81, 3^5 = 243."
      },
      {
        "id": "ra_4",
        "q": "Number Analogy: 11 : 121 :: 13 : ?",
        "options": [
          "169",
          "144",
          "196",
          "182"
        ],
        "answer": 0,
        "explanation": "11^2 = 121, so 13^2 = 169."
      },
      {
        "id": "ra_5",
        "q": "Find the odd one out from the given set of numbers: 27, 64, 125, 144, 216",
        "options": [
          "144",
          "27",
          "64",
          "125"
        ],
        "answer": 0,
        "explanation": "27 (3^3), 64 (4^3), 125 (5^3), and 216 (6^3) are perfect cubes. 144 is 12^2 (a square, not a cube)."
      },
      {
        "id": "ra_6",
        "q": "If in a certain code, '+' means '×', '×' means '÷', and '÷' means '-', what is the value of: 10 + 5 × 2?",
        "options": [
          "25",
          "10",
          "50",
          "20"
        ],
        "answer": 0,
        "explanation": "Replacing operators: 10 × 5 ÷ 2. By BODMAS / order of operations, 10 × 5 = 50, then 50 ÷ 2 = 25."
      },
      {
        "id": "ana_7",
        "q": "Find the next number in the sequence: 2, 6, 12, 20, 30, 42, ?",
        "options": [
          "56",
          "54",
          "52",
          "58"
        ],
        "answer": 0,
        "explanation": "The pattern is n*(n+1): 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30, 6*7=42, 7*8=56 (or differences are +4, +6, +8, +10, +12, +14 -> 42 + 14 = 56)."
      },
      {
        "id": "ana_8",
        "q": "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'MEDICINE' written in that same code?",
        "options": [
          "EOJDJEFM",
          "EOJDEJFM",
          "MFEJDJOE",
          "EOJDJFEM"
        ],
        "answer": 0,
        "explanation": "The first and last letters are swapped: C and R become R and C. The middle letters are each shifted +1 and written in reverse order: O->P, M->N, P->Q, U->V, T->U, E->F. Applying this to MEDICINE (M and E swap to E and M; inner EDICIN reversed and +1 gives OJDJEF) yields EOJDJEFM."
      },
      {
        "id": "ana_9",
        "q": "Find the missing number in the alternating series: 4, 8, 12, 24, 36, 72, ?",
        "options": [
          "108",
          "144",
          "96",
          "84"
        ],
        "answer": 0,
        "explanation": "The pattern alternates multiplying by 2 and multiplying by 1.5: 4 * 2 = 8, 8 * 1.5 = 12, 12 * 2 = 24, 24 * 1.5 = 36, 36 * 2 = 72, 72 * 1.5 = 108."
      },
      {
        "id": "ana_10",
        "q": "If '+' means 'x', '-' means '÷', 'x' means '-', and '÷' means '+', then what is the value of: 16 + 4 - 8 x 5 ÷ 3?",
        "options": [
          "6",
          "8",
          "10",
          "12"
        ],
        "answer": 0,
        "explanation": "Substituting operators: 16 * 4 / 8 - 5 + 3. Following BODMAS: 16 * 4 = 64; 64 / 8 = 8; 8 - 5 + 3 = 3 + 3 = 6."
      },
      {
        "id": "ana_11",
        "q": "Find the odd one out among: 37, 47, 57, 67, 79",
        "options": [
          "57",
          "37",
          "47",
          "67"
        ],
        "answer": 0,
        "explanation": "57 is composite (3 x 19 = 57), whereas 37, 47, 67, and 79 are all prime numbers."
      },
      {
        "id": "ana_12",
        "q": "A clock shows 3:40. What is the angle between the hour hand and the minute hand?",
        "options": [
          "130°",
          "120°",
          "140°",
          "125°"
        ],
        "answer": 0,
        "explanation": "Angle formula: |30H - (11/2)M|. Here H = 3, M = 40. |30(3) - (11/2)(40)| = |90 - 220| = |-130| = 130°."
      }
    ]
  }
};

  let session = {
    topic: null,
    topicTitle: null,
    topicIcon: null,
    level: "beginner",
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    totalDuration: 1200, // 20 mins for beginner/intermediate, 40 mins for advanced
    timeRemaining: 1200,
    timerInterval: null,
    completed: false,
    trophiesAwarded: 0,
    startedAt: null
  };

  function calculateQuizTrophies(score) {
    if (score === 10) return 7; // 10/10 -> 7 Trophies
    if (score >= 5) return 3;   // 5/10 to 9/10 -> 3 Trophies
    return 0;                   // < 5 -> 0 Trophies
  }

  const DailyGrindQuiz = {
    getDomains() {
      return DOMAINS;
    },

    getBank() {
      return QUIZ_BANK;
    },

    getSession() {
      return session;
    },

    calculateTrophies: calculateQuizTrophies,

    startSession(topicKey, levelKey = "beginner", userEmail = "anonymous", dateKey = "", previouslyAnsweredIds = [], attemptIndex = 0) {
      const topicData = QUIZ_BANK[topicKey];
      if (!topicData) {
        throw new Error("Invalid topic selected: " + topicKey);
      }

      const cleanEmail = String(userEmail || "anonymous").trim().toLowerCase();
      const cleanDate = String(dateKey || new Date().toISOString().slice(0, 10));
      const cleanAttempt = Number(attemptIndex) || 0;
      const cleanLevel = (levelKey === "advanced" || levelKey === "intermediate") ? levelKey : "beginner";

      // Duration: Beginner = 20 min (1200s), Intermediate = 20 min (1200s), Advanced = 40 min (2400s)
      const durationSeconds = cleanLevel === "advanced" ? 2400 : 1200;

      // Seeded PRNG based on user + date + attempt + topic + level
      const seedString = `${cleanEmail}_${cleanDate}_att${cleanAttempt}_${topicKey}_${cleanLevel}`;
      const prng = createPrng(seedString);

      // Extract raw pool: if topic has level arrays (like datascience, webdev, aiml), use that; else use questions array
      let rawPool = [];
      if (Array.isArray(topicData[cleanLevel]) && topicData[cleanLevel].length > 0) {
        rawPool = JSON.parse(JSON.stringify(topicData[cleanLevel]));
      } else if (Array.isArray(topicData.questions) && topicData.questions.length > 0) {
        rawPool = JSON.parse(JSON.stringify(topicData.questions));
      } else {
        throw new Error("No questions available for topic: " + topicKey);
      }

      // Filter out previously answered questions so questions don't repeat daily
      let candidatePool = rawPool.filter(q => !previouslyAnsweredIds.includes(q.id));
      if (candidatePool.length < 10) {
        candidatePool = rawPool; // recycle if exhausted
      }

      // Shuffle candidate deck and select top 10
      const shuffledDeck = seededShuffle(candidatePool, prng);
      const selectedTen = shuffledDeck.slice(0, 10);

      // Dynamically shuffle options
      const finalQuestions = selectedTen.map((q, idx) => {
        const optionPrng = createPrng(`${seedString}_q${q.id}_${idx}`);
        return shuffleQuestionOptions(q, optionPrng);
      });

      session = {
        topic: topicKey,
        topicTitle: topicData.title,
        topicIcon: topicData.icon,
        level: cleanLevel,
        questions: finalQuestions,
        currentIndex: 0,
        userAnswers: new Array(finalQuestions.length).fill(null),
        totalDuration: durationSeconds,
        timeRemaining: durationSeconds,
        timerInterval: null,
        completed: false,
        trophiesAwarded: 0,
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

    // Overall countdown timer (20 mins or 40 mins)
    startOverallTimer(onTick, onExpire) {
      this.stopTimer();
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
      const isCorrect = selectedOptionIndex !== null && selectedOptionIndex === q.answer;

      session.userAnswers[questionIndex] = {
        questionId: q.id,
        selectedIndex: selectedOptionIndex,
        isCorrect
      };

      return session.userAnswers[questionIndex];
    },

    generateFinalReport() {
      this.stopTimer();
      session.completed = true;

      const total = session.questions.length;
      let correctCount = 0;

      const review = session.questions.map((q, idx) => {
        const userAns = session.userAnswers[idx] || { selectedIndex: null, isCorrect: false };
        const isCorrect = !!userAns.isCorrect;
        if (isCorrect) correctCount++;

        return {
          index: idx + 1,
          id: q.id,
          question: q.q,
          code: q.code || null,
          options: q.options,
          correctAnswerIndex: q.answer,
          userAnswerIndex: userAns.selectedIndex,
          isCorrect,
          explanation: q.explanation
        };
      });

      const percentage = Math.round((correctCount / total) * 100);
      const trophiesEarned = calculateQuizTrophies(correctCount);
      session.trophiesAwarded = trophiesEarned;

      let rankTitle = "Apex Scholar ⚡";
      let rankDesc = "Flawless technical precision. Unbreakable standard.";
      if (correctCount < 5) {
        rankTitle = "Challenger in Training 🌱";
        rankDesc = "Need 5 or more correct to unlock Vault Trophies. Analyze the breakdown and try again!";
      } else if (correctCount < 10) {
        rankTitle = "Disciplined Master ⚔️";
        rankDesc = "Great job! 5+ questions answered correctly. 3 Vault Trophies unlocked!";
      } else {
        rankTitle = "Flawless Conqueror 👑";
        rankDesc = "Perfection! 10 out of 10 answered correctly. Maximum +7 Vault Trophies awarded!";
      }

      const totalTimeSpent = Math.max(0, session.totalDuration - Math.max(0, session.timeRemaining));

      return {
        topic: session.topic,
        topicTitle: session.topicTitle,
        topicIcon: session.topicIcon,
        level: session.level,
        score: correctCount,
        total,
        percentage,
        trophies: trophiesEarned,
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
