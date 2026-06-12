import json
from flask import Flask, request, jsonify , Response
from upstash_redis import Redis
from dotenv import load_dotenv
import os 

app = Flask(__name__)

load_dotenv()

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
    data = json.loads(request.data)
    print("data")
    print(data)
    redis.lpush(queue_name,data)
    return Response(status=200)

# @app.route('/home/<int:num>', methods=['GET'])
# def disp(num):
#     return jsonify({'data': num ** 2})

if __name__ == '__main__':
    app.run(debug=True,port=3004)