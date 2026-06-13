import json
from flask import Flask, request, jsonify , Response
from upstash_redis import Redis
from dotenv import load_dotenv
import os 

app = Flask(__name__)

load_dotenv()

print("Current working directory:", os.getcwd())
print("Redis URL:", os.getenv("UPSTASH_REDIS_REST_URL"))
print("Redis Token:", os.getenv("UPSTASH_REDIS_REST_TOKEN")[:10] + "...")  # Show first 10 chars
print("Queue Name:", os.getenv("QUEUE_NAME"))

redis = Redis(
    url=os.getenv("UPSTASH_REDIS_REST_URL"),
    token=os.getenv("UPSTASH_REDIS_REST_TOKEN")
)

queue_name = os.getenv("QUEUE_NAME")

@app.route('/', methods=['GET'])
def home():
    return jsonify({'data': 'hello world'})


@app.route('/' , methods=['POST'])
def a_lambda():
    data = request.get_json()
    print("data")
    print(data)
    redis.lpush(queue_name,json.dumps(data))
    return Response(status=200)

# @app.route('/home/<int:num>', methods=['GET'])
# def disp(num):
#     return jsonify({'data': num ** 2})

if __name__ == '__main__':
    app.run(debug=True,host="0.0.0.0",port=3004)