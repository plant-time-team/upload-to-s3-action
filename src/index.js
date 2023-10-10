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

try {
  // Get all the files and folders matching the glob pattern
  const source = core.getInput('source');
  const ignore = core.getInput('ignore');

  let files = await glob(source, { ignore, signal: AbortSignal.timeout(10000), withFileTypes: true });

  // Filter out directories and map to their full path
  files = files.filter((file) => !file.isDirectory()).map((file) => file.fullpath());

  // Create a new S3 client

  // Check if the bucket exists

  // If the user specified that the destination should be cleared, delete all the files in the bucket at the destination first

  // Upload each file to the bucket

  // Log which files were uploaded
  core.info(`Uploading ${files.length} files:\n${files.join('\n')}`);
} catch (err) {
  core.error(err);
  core.setFailed(err.message);
}
