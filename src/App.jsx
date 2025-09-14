import "./App.css";
import { pdfjs } from "react-pdf";
import PaginatedPdfViewer from "./pdfViewer/PaginatedPdfViewer";
import DummyPdf from "./assets/DummyPdf.pdf";
import { Grid } from "@mui/material";
import PdfViewer from "./pdfViewer/PdfViewer";

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
function App() {
  return (
    <>
      <Grid container>
        <Grid item size={{ sm: 12, md: 6 }}>
          <PaginatedPdfViewer file={DummyPdf} />
        </Grid>
        <Grid item size={{ sm: 12, md: 6 }}>
          <PdfViewer file={DummyPdf} />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
