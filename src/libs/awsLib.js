import { Storage } from 'aws-amplify';
import config from '../config';

export async function s3Upload(file) {
    const filename = `${Date.now()}-${file.name}`;

    const stored = await Storage.vault.put(filename, file, {
        contentType: file.type
    });

    return stored.key;
}

export async function s3Remove(key) {
    let options = { bucket: config.s3.BUCKET, region: config.s3.REGION };
    console.log('Gonna try to delete');

    try {
        return await Storage.vault.remove(key, options);
    } catch(e) {
        console.log('Some error');
        console.log(e);
    }
}