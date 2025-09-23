export interface OutlineDocument {
  id: string;
  url: string;
  urlId: string;
  title: string;
  text: string;
}

export interface OutlineApiResponse {
  data: OutlineDocument;
}

export interface FetchDocumentResult {
  success: boolean;
  title?: string;
  content?: string;
  error?: string;
}

export interface FetchMultipleDocumentsResult {
  success: boolean;
  titles?: string[];
  content?: string;
  error?: string;
}

export const OUTLINE_IDS = {
  satzung: "2da98f0c-01bb-4ba6-b093-343303c31469",
  datenschutzHinweise: "cd7f7c71-faf0-4fe2-b751-c81c0045aad8",
  datenschutzOrdnung: "a36d978e-bd70-4eea-8ccc-722ad68e8b0c",
  datenschutzWebsite: "18b72433-61b3-40b5-8bc2-652001d52665",
};

export async function fetchOutlineDocument(
  documentId: string
): Promise<FetchDocumentResult> {
  try {
    const response = await fetch(
      "https://notes.neuland-ingolstadt.de/api/documents.info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OUTLINE_API_KEY}`,
        },
        body: JSON.stringify({
          id: documentId,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status}`);
    }

    const data: OutlineApiResponse = await response.json();
    return {
      success: true,
      title: data.data.title,
      content: data.data.text.replace(/\\n/g, "\n"),
    };
  } catch (error) {
    console.error("Error fetching Outline document:", error);
    return { success: false, error: String(error) };
  }
}

export async function fetchMultipleOutlineDocuments(
  documentIds: string[]
): Promise<FetchMultipleDocumentsResult> {
  try {
    const documents = await Promise.all(
      documentIds.map((id) => fetchOutlineDocument(id))
    );

    // Check if any document failed to fetch
    const failedDocument = documents.find((doc) => !doc.success);
    if (failedDocument) {
      return { success: false, error: failedDocument.error };
    }

    const titles = documents
      .map((doc) => doc.title)
      .filter(Boolean) as string[];
    const combinedContent = documents
      .map((doc) => `# ${doc.title}\n\n${doc.content?.replace(/\\n/g, "\n")}`)
      .join("\n\n");

    return {
      success: true,
      titles,
      content: combinedContent,
    };
  } catch (error) {
    console.error("Error fetching multiple Outline documents:", error);
    return { success: false, error: String(error) };
  }
}
