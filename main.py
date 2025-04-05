import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import datetime
import os
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from flask import Flask, render_template_string, request

DATA_PATH = 'weather_data.csv'
if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}.")

df = pd.read_csv(DATA_PATH)
print("Data loaded successfully.\n")
print(df.head())

features = ['temperature', 'humidity', 'pressure', 'wind_speed', 'sea_level']
target = 'temperature'
df = df[features].dropna()
scaler = MinMaxScaler()
scaled_data = scaler.fit_transform(df)

X_temp, y_temp = [], []
X_sea, y_sea = [], []
sequence_length = 7

for i in range(sequence_length, len(scaled_data)):
    X_temp.append(scaled_data[i-sequence_length:i])
    y_temp.append(scaled_data[i][0])
    y_sea.append(scaled_data[i][4])

X_temp, y_temp = np.array(X_temp), np.array(y_temp)
y_sea = np.array(y_sea)

X_train_t, X_test_t, y_train_t, y_test_t = train_test_split(X_temp, y_temp, test_size=0.2, random_state=42, shuffle=False)
X_train_s, X_test_s, y_train_s, y_test_s = train_test_split(X_temp, y_sea, test_size=0.2, random_state=42, shuffle=False)

model_temp = Sequential()
model_temp.add(LSTM(128, return_sequences=True, input_shape=(X_temp.shape[1], X_temp.shape[2])))
model_temp.add(Dropout(0.2))
model_temp.add(LSTM(64))
model_temp.add(Dropout(0.2))
model_temp.add(Dense(1))
model_temp.compile(optimizer='adam', loss='mean_squared_error')
model_temp.fit(X_train_t, y_train_t, epochs=50, batch_size=16, validation_split=0.1, callbacks=[EarlyStopping(patience=10)], verbose=1)

y_pred_temp = model_temp.predict(X_test_t)
scaler_temp = MinMaxScaler()
scaler_temp.fit(df[['temperature']])
y_pred_temp_inv = scaler_temp.inverse_transform(y_pred_temp)
y_test_temp_inv = scaler_temp.inverse_transform(y_test_t.reshape(-1, 1))

model_sea = Sequential()
model_sea.add(LSTM(128, return_sequences=True, input_shape=(X_temp.shape[1], X_temp.shape[2])))
model_sea.add(Dropout(0.2))
model_sea.add(LSTM(64))
model_sea.add(Dropout(0.2))
model_sea.add(Dense(1))
model_sea.compile(optimizer='adam', loss='mean_squared_error')
model_sea.fit(X_train_s, y_train_s, epochs=50, batch_size=16, validation_split=0.1, callbacks=[EarlyStopping(patience=10)], verbose=1)

y_pred_sea = model_sea.predict(X_test_s)
scaler_sea = MinMaxScaler()
scaler_sea.fit(df[['sea_level']])
y_pred_sea_inv = scaler_sea.inverse_transform(y_pred_sea)
y_test_sea_inv = scaler_sea.inverse_transform(y_test_s.reshape(-1, 1))

app = Flask(__name__)

template = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Weather & Sea Level Prediction</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f8ff; padding: 40px; }
        h1 { color: #004080; }
        .data { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px #ccc; }
    </style>
</head>
<body>
    <h1>Weather & Sea Level Prediction</h1>
    <div class="data">
        <h2>Temperature Forecast</h2>
        <p>Last Predicted Temperature: {{ temp_pred }}°C</p>
        <h2>Sea Level Forecast</h2>
        <p>Last Predicted Sea Level: {{ sea_pred }} meters</p>
    </div>
</body>
</html>
'''

@app.route('/')
def home():
    temp_pred = float(y_pred_temp_inv[-1])
    sea_pred = float(y_pred_sea_inv[-1])
    return render_template_string(template, temp_pred=round(temp_pred, 2), sea_pred=round(sea_pred, 2))

if __name__ == '__main__':
    app.run(debug=True)

print("\nModels Used:")
print("1. LSTM (Long Short-Term Memory) - for both temperature and sea level prediction")
print("2. Dense, Dropout - for neural network layers")
print("3. MinMaxScaler - for scaling input features")
print("4. EarlyStopping - to prevent overfitting")
print("5. Flask - to host predictions in a simple web application")
