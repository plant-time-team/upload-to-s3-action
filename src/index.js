/*import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
} from '@aws-sdk/client-s3';*/

import core from '@actions/core';
import { glob } from 'glob';

const source = core.getInput('source');
//const destination = core.getInput('destination');
const ignore = core.getInput('ignore');
//const bucketName = core.getInput('bucket');
//const accessKey = core.getInput('access_key');
//const secretKey = core.getInput('secret_key');
//const region = core.getInput('region');

try {
  // Get all the files and folders matching the glob pattern

  let files = await glob(source, { ignore, signal: AbortSignal.timeout(10000), withFileTypes: true });

  // Filter out directories and map to their full path
  files = files.filter((file) => !file.isDirectory()).map((file) => file.fullpath());

  // Create a new S3 client

  // Check if the bucket exists

  // If the user specified that the destination should be cleared, delete all the files in the bucket at the destination first

  // Upload each file to the bucket

  // Log which files were uploaded
  core.info(`Uploading ${files.length} files to ${BUCKET_NAME}:\n${files.join('\n')}`);
} catch (err) {
  core.error(err);
  core.setFailed(err.message);
}