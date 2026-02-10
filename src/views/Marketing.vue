<template>
  <div>
    <h1 class="text-3xl font-bold dark:text-white mb-6">Marketing & SMS</h1>

    <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li class="mr-2">
                <button @click="activeTab = 'inquiries'" :class="activeTab === 'inquiries' ? 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'">Inquiries</button>
            </li>
            <li class="mr-2">
                <button @click="activeTab = 'campaigns'" :class="activeTab === 'campaigns' ? 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'">SMS Campaigns</button>
            </li>
        </ul>
    </div>

    <!-- Inquiries Tab -->
    <div v-if="activeTab === 'inquiries'">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold dark:text-white">Inquiries</h2>
            <BaseButton @click="openInquiryModal">Add Inquiry</BaseButton>
        </div>

        <BaseTable>
             <template #head>
                <th scope="col" class="px-6 py-3">Date</th>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3">Phone</th>
                <th scope="col" class="px-6 py-3">Msg Count</th>
                <th scope="col" class="px-6 py-3">Message</th>
                <th scope="col" class="px-6 py-3">Status</th>
            </template>
            <template #body>
                <tr v-for="inquiry in visibleInquiries" :key="inquiry.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="px-6 py-4">{{ formatDate(inquiry.date) }}</td>
                    <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ inquiry.name }}</td>
                    <td class="px-6 py-4">{{ inquiry.phone }}</td>
                    <td class="px-6 py-4 font-semibold">{{ inquiry.message_count || 0 }} / 3</td>
                    <td class="px-6 py-4">{{ inquiry.message }}</td>
                    <td class="px-6 py-4">
                        <span :class="getStatusBadge(inquiry.status)">{{ inquiry.status }}</span>
                    </td>
                </tr>
                 <tr v-if="visibleInquiries.length === 0">
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No inquiries found.</td>
                </tr>
            </template>
        </BaseTable>
    </div>

    <!-- Campaigns Tab -->
    <div v-if="activeTab === 'campaigns'">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Automation Card -->
            <div class="bg-white p-6 rounded-lg shadow dark:bg-gray-800 col-span-1 md:col-span-2">
                <h2 class="text-xl font-semibold dark:text-white mb-2">Automated Follow-ups</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                    Sends follow-up messages to inquiries less than 30 days old with fewer than 3 messages sent.
                    Inquiries are removed/archived after 3 messages.
                </p>
                <div class="flex items-center gap-4">
                    <BaseButton @click="runAutomation" :disabled="runningAutomation">
                        {{ runningAutomation ? 'Running...' : 'Run Automation Rules' }}
                    </BaseButton>
                    <span v-if="automationResult" class="text-sm font-medium" :class="automationResult.success ? 'text-green-600' : 'text-red-600'">
                        {{ automationResult.message }}
                    </span>
                </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
                <h2 class="text-xl font-semibold dark:text-white mb-4">Send SMS</h2>
                <form @submit.prevent="sendSMS">
                    <div class="mb-4">
                        <BaseSelect v-model="smsForm.audience" label="Select Audience">
                            <option value="manual">Manual Number</option>
                            <option value="inquiries">All Inquiries (List)</option>
                            <option value="all">All Contacts (Broadcast)</option>
                        </BaseSelect>
                    </div>

                    <div v-if="smsForm.audience === 'manual'" class="mb-4">
                        <BaseInput v-model="smsForm.to" label="Phone Number" placeholder="+1234567890" />
                    </div>

                    <div class="mb-4">
                        <BaseTextarea v-model="smsForm.message" label="Message" rows="4" placeholder="Type your message here..." required />
                    </div>

                    <BaseButton type="submit" :disabled="sending">
                        {{ sending ? 'Sending...' : 'Send Message' }}
                    </BaseButton>
                </form>
            </div>

            <div class="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
                <h2 class="text-xl font-semibold dark:text-white mb-4">Quick Actions</h2>
                <p class="text-gray-500 dark:text-gray-400 mb-4">Send reminders to all clients with events scheduled for this upcoming Saturday.</p>
                <BaseButton @click="sendReminders" variant="secondary" :disabled="sendingReminders">
                     {{ sendingReminders ? 'Processing...' : 'Send Upcoming Event Reminders' }}
                </BaseButton>
                <div v-if="reminderResult" class="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    {{ reminderResult }}
                </div>
            </div>
         </div>
    </div>

    <!-- Add Inquiry Modal -->
    <BaseModal :show="showModal" title="Add New Inquiry" @close="closeModal">
        <form @submit.prevent="createInquiry" class="space-y-4">
            <BaseInput v-model="form.name" label="Name" />
            <BaseInput v-model="form.phone" label="Phone Number" required />
            <BaseTextarea v-model="form.message" label="Inquiry Message/Notes" />
        </form>
        <template #footer>
            <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
            <BaseButton @click="createInquiry">Save Inquiry</BaseButton>
        </template>
    </BaseModal>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api';
import BaseButton from '../components/common/BaseButton.vue';
import BaseInput from '../components/common/BaseInput.vue';
import BaseSelect from '../components/common/BaseSelect.vue';
import BaseTextarea from '../components/common/BaseTextarea.vue';
import BaseModal from '../components/common/BaseModal.vue';
import BaseTable from '../components/common/BaseTable.vue';

const activeTab = ref('inquiries');
const inquiries = ref([]);
const showModal = ref(false);
const sending = ref(false);
const sendingReminders = ref(false);
const runningAutomation = ref(false);
const reminderResult = ref('');
const automationResult = ref(null);

const form = ref({
    name: '',
    phone: '',
    message: ''
});

const smsForm = ref({
    audience: 'manual',
    to: '',
    message: ''
});

const loadInquiries = async () => {
    try {
        const res = await api.get('/marketing/inquiries');
        inquiries.value = res.data;
    } catch (err) {
        console.error(err);
    }
};

const visibleInquiries = computed(() => {
    return inquiries.value.filter(i => i.status !== 'removed');
});

const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString();
};

const getStatusBadge = (status) => {
    if (status === 'removed') return 'bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300';
    if (status === 'new') return 'bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300';
    return 'bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300';
};

const openInquiryModal = () => {
    form.value = { name: '', phone: '', message: '' };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const createInquiry = async () => {
    try {
        await api.post('/marketing/inquiries', form.value);
        await loadInquiries();
        closeModal();
    } catch (err) {
        console.error(err);
        alert('Failed to create inquiry');
    }
};

const sendSMS = async () => {
    sending.value = true;
    try {
        let recipients = [];
        const payload = {
            message: smsForm.value.message,
            audience: smsForm.value.audience
        };

        if (smsForm.value.audience === 'manual') {
            if (!smsForm.value.to) {
                alert('Please enter a phone number');
                sending.value = false;
                return;
            }
            payload.to = [smsForm.value.to];
        } else if (smsForm.value.audience === 'inquiries') {
            recipients = inquiries.value.map(i => i.phone).filter(Boolean);
            if (recipients.length === 0) {
                 alert('No inquiries with phone numbers found');
                 sending.value = false;
                 return;
            }
            payload.to = recipients;
        }
        // If audience is 'all', backend handles retrieval

        await api.post('/marketing/sms/send', payload);
        alert('Messages sent successfully (Mock)');
        smsForm.value.message = '';
    } catch (err) {
        console.error(err);
        alert('Failed to send SMS');
    } finally {
        sending.value = false;
    }
};

const runAutomation = async () => {
    runningAutomation.value = true;
    automationResult.value = null;
    try {
        const res = await api.post('/marketing/automations/run');
        automationResult.value = {
            success: true,
            message: `Sent: ${res.data.sent_count}, Removed: ${res.data.removed_count}`
        };
        await loadInquiries(); // Reload to see updates
    } catch (err) {
        console.error(err);
        automationResult.value = {
            success: false,
            message: 'Failed to run automation'
        };
    } finally {
        runningAutomation.value = false;
    }
};

const sendReminders = async () => {
    sendingReminders.value = true;
    reminderResult.value = '';
    try {
        const res = await api.post('/marketing/reminders');
        reminderResult.value = `Sent ${res.data.sent_count} reminders successfully.`;
    } catch (err) {
        console.error(err);
        alert('Failed to send reminders');
    } finally {
        sendingReminders.value = false;
    }
};

onMounted(() => {
    loadInquiries();
});
</script>
