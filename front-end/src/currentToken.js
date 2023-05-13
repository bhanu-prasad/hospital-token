import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

const CurrentTokenPage = ({ socket }) => {
  const [currentName, setCurrentName] = useState("");
  const [currentID, setCurrentID] = useState("");

  useEffect(() => {
    
    socket.on("token", (resp) => {
      setCurrentName(resp.name);
      setCurrentID(resp.token);
    });
  });
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Current Patient</h1>
      <Card sx={{ display: "flex" }} style={{ backgroundColor: "#0CFD22" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography component="div" variant="h5">
              Token : {currentID === "" ? "None" : "T-" + currentID}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              Name : {currentName === "" ? "None" : currentName}
            </Typography>
          </CardContent>
        </Box>
      </Card>
    </div>
  );
};
export default CurrentTokenPage;
