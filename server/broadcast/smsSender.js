/**
 * Mock SMS Sending Logic
 *
 * @param {Array<string>|string} to - Recipient phone number(s)
 * @param {string} message - Message content
 * @returns {Promise<object>} - Result with success status and count
 */
export async function sendSMS(to, message) {
    const recipients = Array.isArray(to) ? to : [to];

    if (recipients.length === 0) {
        return { success: true, count: 0 };
    }

    console.log(`[SMS MOCK] Sending message "${message}" to ${recipients.length} recipients: ${recipients.join(', ')}`);

    // In a real app, we would call an SMS provider API here
    // and log the result to a database table.

    return { success: true, count: recipients.length };
}
