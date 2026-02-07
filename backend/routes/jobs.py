from flask import Flask, request, jsonify

app = Flask(__name__)

jobs = []  # List to store job postings
referrals = []  # List to store referrals


@app.route('/jobs', methods=['POST'])
def post_job():
    job = request.json  # Expecting job data as JSON
    jobs.append(job)  # Add job to the list
    return jsonify({'message': 'Job posted successfully!'}), 201


@app.route('/jobs', methods=['GET'])
def view_jobs():
    return jsonify(jobs)  # Return the list of jobs


@app.route('/referrals', methods=['POST'])
def submit_referral():
    referral = request.json  # Expecting referral data as JSON
    referrals.append(referral)  # Add referral to the list
    return jsonify({'message': 'Referral submitted successfully!'}), 201


@app.route('/referral-status', methods=['GET'])
def track_referral():
    referral_id = request.args.get('id')  # Get referral ID from query parameters
    for referral in referrals:
        if referral.get('id') == referral_id:
            return jsonify(referral)  # Return specific referral details
    return jsonify({'message': 'Referral not found.'}), 404


if __name__ == '__main__':
    app.run(debug=True)