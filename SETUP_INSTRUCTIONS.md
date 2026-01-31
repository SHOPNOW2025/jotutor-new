# Google Sheets Database Setup Instructions (Simplified)

Follow these steps to connect your app to the Google Sheet you provided.

## Step 1: Prepare Your Google Sheet

1.  Make sure you have created a Google Sheet and it has the following tabs, with the exact names:
    *   `Users`
    *   `Teachers`
    *   `Courses`
    *   `Staff`
    *   `Payments`
    *   `Testimonials`
    *   `Blog`
    *   `HeroSlides`
    *   `Config`

2.  Ensure each tab has the correct column headers as specified in the original instructions. The app will not work if the headers are incorrect.
3.  Ensure the `Config` tab is populated correctly (see original instructions).

## Step 2: Create and Deploy the Apps Script

1.  In your Google Sheet, go to **Extensions > Apps Script**. A new browser tab will open with the script editor.
2.  If there is any code in the `Code.gs` file, delete it completely.
3.  **Copy the entire content** from the `Code.gs` file provided in this project.
4.  **Paste the code** into the empty script editor. The Spreadsheet ID is already included for you.
5.  Click the **Save project** icon (looks like a floppy disk).
6.  At the top right, click **Deploy > New deployment**.
7.  Click the gear icon next to "Select type" and choose **Web app**.
8.  Configure the deployment:
    *   **Description:** "JoTutor API".
    *   **Execute as:** **Me** (your Google account).
    *   **Who has access:** **Anyone**. (This is important, it allows the app to fetch data).
9.  Click **Deploy**.
10. **Authorize access:** A popup will appear.
    *   Click **Authorize access**.
    *   Choose your Google account.
    *   You might see a "Google hasn't verified this app" warning. Click **Advanced**, then click **Go to [Your Project Name] (unsafe)**.
    *   Finally, click **Allow**.
11. After authorizing, you will see a "Deployment successfully updated" popup. **Copy the Web app URL**. It starts with `https://script.google.com/...`.

## Step 3: Connect the App to Your Sheet

1.  Open the `googleSheetService.ts` file in your app's code.
2.  Find the line `const SCRIPT_URL = '...';`
3.  **Replace the placeholder URL** with the Web app URL you just copied in the previous step.
4.  Save the file.

**That's it!** Refresh your app. It is now fully connected to your Google Sheet for both reading and writing data.
