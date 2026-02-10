/**
 * Audience Management Logic
 */

export async function getRecipients(audience, db, manualTo = null) {
    let recipients = [];

    if (audience === 'manual') {
        if (manualTo) {
            recipients = [manualTo];
        }
    } else if (audience === 'inquiries') {
        const inquiryPhones = await db.all('SELECT DISTINCT phone FROM inquiries WHERE phone IS NOT NULL AND status != "removed"');
        recipients = inquiryPhones.map(i => i.phone);
    } else if (audience === 'all') {
        // Fetch all unique phones from inquiries and events
        const inquiryPhones = await db.all('SELECT DISTINCT phone FROM inquiries WHERE phone IS NOT NULL AND status != "removed"');
        const eventPhones = await db.all('SELECT DISTINCT client_phone as phone FROM events WHERE client_phone IS NOT NULL');

        const phoneSet = new Set();
        inquiryPhones.forEach(p => phoneSet.add(p.phone));
        eventPhones.forEach(p => phoneSet.add(p.phone));

        recipients = Array.from(phoneSet);
    }

    return recipients;
}
