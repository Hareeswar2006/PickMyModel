const API_BASE = "https://pickmymodel.onrender.com";


async function handleResponse(res) {
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data.detail || data.message || message;
    } catch {
    }
    throw new Error(message);
  }
  return res.json();
}


export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  });

  return handleResponse(res);
}


export async function validateDataset({ tmpPath, problemType, targetColumn}) {
  const res = await fetch(`${API_BASE}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tmp_path: tmpPath,
      problem_type: problemType,
      target_column: targetColumn
    })
  });

  return handleResponse(res);
}

export async function analyzeDataset({ tmpPath, problemType, targetColumn, isGuest = true}) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tmp_path: tmpPath,
      problem_type: problemType,
      target_column: targetColumn,
      is_guest: isGuest
    })
  });

  return handleResponse(res);
}


export async function getFeatures(problemType, datasetId) {
  const res = await fetch(
    `${API_BASE}/features/${problemType}/${datasetId}`
  );
  if (!res.ok) throw new Error("Failed to fetch features");
  return res.json();
}


export async function predict({ datasetId, problemType, rows }) {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataset_id: datasetId,
      problem_type: problemType,
      rows
    })
  });
  return res.json();
}

