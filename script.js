import { createClient }         // load supabase database
  from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://jnkaamrdhheozseeoqck.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vDFvTKPO80I-CeeGNChvbA_Pg_tMnrx";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const form = document.getElementById("messageForm");
const messagesDiv = document.getElementById("messages");

async function loadMessages() {
  const { data, error } = await supabase        // get all rows (messages) sorted by date/time
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {       // error checking
    console.error(error);
    messagesDiv.textContent = "Could not load messages.";
    return;
  }

  messagesDiv.innerHTML = "";      // clear messages div in page

  for (const message of data) {
    const div = document.createElement("div");      // create a div per message
    div.className = "message";

    div.innerHTML = `
      <div class="username"></div>
      <div class="text"></div>
      <div class="date"></div>
      <button class="copy-button">Copy</button>
    `;

    div.querySelector(".username").textContent = message.username;        // populate div
    div.querySelector(".text").textContent = message.message;
    div.querySelector(".date").textContent =
      new Date(message.created_at).toLocaleString();

    div.querySelector(".copy-button").onclick = () =>
      navigator.clipboard.writeText(message.message);

    messagesDiv.appendChild(div);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();          // don't reload page upon submitting 'form'

  const username = document.getElementById("username").value.trim();    // get name and message
  const message = document.getElementById("message").value.trim();

  if (!username || !message) return;      // no empty messages or name

  const { error } = await supabase    // add message as row to database
    .from("messages")
    .insert({
      username: username,
      message: message
    });

  if (error) {              // error checking
    console.error(error);
    alert("Could not post message.");
    return;
  }

  document.getElementById("message").value = "";       // clear message box (not name)

  await loadMessages();
});

loadMessages();
