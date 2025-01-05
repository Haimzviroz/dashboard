import { Box, Container } from '@mui/material';
import { useRouter } from 'next/router';

const ErrorPage = ({ statusCode, message }) => {
  
  const router = useRouter();
  if (!statusCode && router.query.statusCode) {
    statusCode = router.query.statusCode;
  }

  if (!message && router.query.message) {
    message = router.query.message;
  }

  return (
    <Container sx={{ textAlign: "center" }}>
      <Box sx={{ height: "95vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {statusCode && message
          ? <div>
            <div>An error {statusCode} occurred on server</div>
            <div>{message}</div>
          </div>
          : 'An error occurred on client'}
      </Box>
    </Container>
  );
}

ErrorPage.GetServerSideProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage