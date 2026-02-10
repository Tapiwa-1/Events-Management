import { Inquiry } from '../models/Inquiry.js';
import { Event } from '../models/Event.js';

/**
 * Audience Management Logic
 */

export async function getRecipients(audience, manualTo = null) {
    let recipients = [];

    if (audience === 'manual') {
        if (manualTo) {
            recipients = [manualTo];
        }
    } else if (audience === 'inquiries') {
        const inquiryPhones = await Inquiry.query('SELECT DISTINCT phone FROM inquiries WHERE phone IS NOT NULL AND status != "removed"');
        recipients = inquiryPhones.map(i => i.phone);
    } else if (audience === 'all') {
        // Fetch all unique phones from inquiries and events
        const inquiryPhones = await Inquiry.query('SELECT DISTINCT phone FROM inquiries WHERE phone IS NOT NULL AND status != "removed"');
        const eventPhones = await Event.query('SELECT DISTINCT client_phone as phone FROM events WHERE client_phone IS NOT NULL');

        const phoneSet = new Set();
        inquiryPhones.forEach(p => phoneSet.add(p.phone));
        eventPhones.forEach(p => phoneSet.add(p.phone));

        recipients = Array.from(phoneSet);
    }

    return recipients;
}
