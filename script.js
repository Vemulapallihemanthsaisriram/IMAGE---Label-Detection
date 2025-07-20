// Replace these with your own IAM user's access and secret keys
const ACCESS_KEY = 'enter_your_access_key_here';
const SECRET_KEY = 'enter_your_secret_key_here';
const REGION = 'us-east-1'; // e.g., us-west-2

AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
    region: REGION
});

const rekognition = new AWS.Rekognition();

document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const file = document.getElementById('imageUpload').files[0];
    if (!file) {
        alert('Please select an image');
        return;
    }

    // Show image preview
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Show loading message
    document.getElementById('loading').style.display = 'block';

    try {
        const labels = await detectLabels(file);
        document.getElementById('output').innerHTML = formatLabels(labels.Labels);
    } catch (error) {
        console.error('Error detecting labels:', error);
        alert('Error detecting labels.');
    } finally {
        // Hide loading message
        document.getElementById('loading').style.display = 'none';
    }
});

async function detectLabels(file) {
    const arrayBuffer = await file.arrayBuffer();
    const params = {
        Image: { Bytes: arrayBuffer },
        MaxLabels: 10
    };

    return rekognition.detectLabels(params).promise();
}

function formatLabels(labels) {
    return labels.map(label => `<p><strong>${label.Name}</strong>: ${label.Confidence.toFixed(2)}%</p>`).join('');
}
