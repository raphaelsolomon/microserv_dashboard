import crypto  from 'crypto';

class helperUtils {
    generateApiKey(serviceId: string) {
        const servicePrefix = serviceId.substring(0, 3).toUpperCase();
        const randomBytes = crypto.randomBytes(16).toString('hex');
        return `${servicePrefix}_${randomBytes}`;
    }
}