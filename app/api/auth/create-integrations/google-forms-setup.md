# Google Form Integration Setup

This guide explains how to connect your Google Form to automatically create user accounts and send login credentials when customers submit the form.

## Setup Steps

### 1. Create or Use an Existing Google Form

- Ensure your form collects at least the following fields:
  - **Email** (required - must match the email used for payment)
  - Name
  - Company Name
  - Phone
  - Website URL (if they have an existing site)
  - Website Goals
  - Design Preferences

### 2. Set Up Make.com (formerly Integromat) Integration

Make.com is the easiest way to connect Google Forms to our webhook endpoint.

1. **Create a Make.com account** if you don't have one
2. **Create a new scenario** with these modules:
   - **Trigger**: Google Forms > Watch Responses
   - **Action**: HTTP > Make a request
     - URL: `https://kaizendigitaldesign.com/api/forms/google-form-webhook`
     - Method: POST
     - Body type: JSON
     - Request body: Map the form fields to a JSON structure like this:
       ```json
       {
         "email": "{{email}}",
         "name": "{{name}}",
         "companyName": "{{companyName}}",
         "phone": "{{phone}}",
         "websiteUrl": "{{websiteUrl}}",
         "websiteGoals": "{{websiteGoals}}",
         "designPreferences": "{{designPreferences}}"
       }
       ```
     - Parse response: Yes

3. **Set the scenario to run automatically** after form submissions

### 3. Update Environment Variables

Ensure these environment variables are set in your `.env` file:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@kaizendigitaldesign.com
ADMIN_EMAIL=admin@kaizendigitaldesign.com
```

### 4. Alternative: Direct Integration with Google Apps Script

If you prefer not to use Make.com, you can use Google Apps Script:

1. In your Google Form, go to the three dots menu > Script editor
2. Add this code:

```javascript
function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  
  var data = {};
  
  // Map form fields to JSON
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var title = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();
    
    // Map field titles to API expected fields
    switch(title) {
      case "Email Address":
        data.email = answer;
        break;
      case "Your Name":
        data.name = answer;
        break;
      // Add mappings for other fields
    }
  }
  
  // Send data to webhook
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data)
  };
  
  var response = UrlFetchApp.fetch('https://kaizendigitaldesign.com/api/forms/google-form-webhook', options);
}

function setUpTrigger() {
  var form = FormApp.getActiveForm();
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
}
```

3. Run the `setUpTrigger()` function once to create the form submission trigger

## Troubleshooting

- **Emails not being sent**: Check the email service credentials
- **Customer not found**: Ensure the email in the form matches the one used during payment
- **Webhook errors**: Check server logs for detailed error messages

## Testing

To test the integration:
1. Make a test payment with your email
2. Fill out the Google Form with the same email
3. Check for the email with login credentials
4. Try logging in with the provided credentials 