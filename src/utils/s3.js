const { S3Client } = require("@aws-sdk/client-s3")
const { Upload } = require("@aws-sdk/lib-storage")
const {
	AWS_ACCSESS_KEY_ID,
	AWS_SECRET_ACCSESS_KEY,
	AWS_REGION, AWS_URL,
	AWS_BUCKET_NAME
} = require("./secret.js")

const s3Client = new S3Client({
	region: AWS_REGION,
	endpoint: AWS_URL,
	credentials: {
		accessKeyId: AWS_ACCSESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCSESS_KEY,
	},

})

const uploadFileS3 = async (key, buffer) => {
	const upload = new Upload({
		client: s3Client,
		params: {
			Bucket: AWS_BUCKET_NAME,
			Key: key,
			Body: buffer
		}
	})
	try {
		const data = await upload.done()
		if (data.$metadata.httpStatusCode === 200) {
			return data.Location
		}

	} catch (error) {
		console.error("Error uploading file ", error)
	}
}

module.exports = {
	uploadFileS3
}