//'.js' usual for a file that exports an API function and contains no JSX.

//Handles failed HTTP responses in one shared place.
async function checkResponse(response, action) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.message || data.error || `${action} (${response.status})`
    );
  }

  return response;
}

//Sends authenticated GET-request, checks errors, verifies response's list, and returns it.
export async function getTransactions(request) {
  const response = await request("/api/transactions");
  await checkResponse(response, "Could not load transactions");

  const transactions = await response.json();

  if (!Array.isArray(transactions)) {
    throw new Error("The server returned an unexpected transaction list.");
  }

  return transactions;
}

//Sends authenticated POST-request with transaction as JSON, then returns the saved transaction.
export async function createTransaction(request, transaction) {
  const response = await request("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });

  await checkResponse(response, "Could not save transaction");
  return response.json();
}

// Sends authenticated DELETE-request. It doesn’t parse a success body because the backend responds with 204 No Content.
export async function deleteTransaction(request, id) {
  //encodeURIComponent(id) is a small safety measure in case an ID ever contains characters that 
  //have special meaning in a URL, such as /, ?, or a space. It encodes the ID as one path segment.

  const response = await request(
    `/api/transactions/${encodeURIComponent(id)}`,
    { method: "DELETE" }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.message || data.error || `Could not delete transaction (${response.status})`
    );
  }
}