import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
} from "@mui/material";

const AccessTokens = () => {
  return (
    <Card sx={{margin: "16px", padding: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="span"
              sx={{
                marginRight: 1,
                display: "inline-flex",
                alignItems: "center",
                fontSize: "1.5rem",
              }}
            >
              🔑
            </Box>
            Access Tokens
          </Box>
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingY={1}
        >
          <Box>
            <Typography variant="body1">Production API Key</Typography>
            <Typography variant="body2" color="textSecondary">
              Created on Mar 15, 2024
            </Typography>
          </Box>
          <Button
            variant="text"
            color="error"
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Revoke
          </Button>
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <Link href="#" underline="hover" variant="body2" color="primary">
          + Generate New Token
        </Link>
      </CardContent>
    </Card>
  );
};

export default AccessTokens;
