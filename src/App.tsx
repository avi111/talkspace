import { Box, Container, Typography } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ImageUploadCard} from "./components/ImageUpload/ImageUploadCard.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Image Share
          </Typography>
          <Typography variant="body1" align="center">
            Upload and share your images with temporary links
          </Typography>
          <ImageUploadCard />
        </Box>
      </Container>
    </QueryClientProvider>
  );
}

export default App;