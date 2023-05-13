import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

export default function Home({ socket }) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [currentID, setCurrentID] = useState("");
  const [tokenList, setTokenList] = useState([]);
  const getTokens = () => {
    axios.get("http://localhost:3010/tokens").then((response) => {
      // console.log(response);
      const transformedArray = response.data.map((obj) => {
        const { name, phone, token } = obj;
        return { name, phone, id: `T-${token}`, token };
      });
      setTokenList(transformedArray);
    });
  };
  useEffect(() => {
    socket.on("token", (resp) => {
      setCurrentName(resp.name);
      setCurrentID(resp.token);
    });
  });
  useEffect(getTokens, []);
  useEffect(() => {}, [tokenList]);

  const handleSubmit = async () => {
    if (name === "" || String(number).length !== 10) {
      alert("partial data");
      return;
    } else {
      let result = await axios.post("http://localhost:3010/token", {
        name: name,
        number: number,
      });
      document.getElementById("name").value = "";
      document.getElementById("mobile").value = "";
      getTokens();
    }

    // scocket code
  };
  const clearTokens = async () => {
    await axios.delete("http://localhost:3010/");
    getTokens();
    socket.emit("nextToken");
  };
  const handleNext = () => {
    axios.patch("http://localhost:3010/next").then((response) => {
      socket.emit("nextToken");
    });
  };
  const columns = [
    { field: "id", headerName: "Token", width: "70" },
    { field: "name", headerName: "Patient Name", width: "250" },
    { field: "phone", headerName: "Mobile Number", width: "170" },
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>Current Patient</h3>
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
      <h3>Patients</h3>
      <div
        style={{
          width: "550px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DataGrid
          rows={tokenList}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 3 },
            },
          }}
          pageSizeOptions={[3]}
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button color="success" variant="contained" onClick={handleNext}>
          Next Patient
        </Button>
        <Button
          style={{ marginLeft: "20px" }}
          color="error"
          variant="contained"
          onClick={clearTokens}
        >
          Clear
        </Button>
      </div>
      <div>
        <h3>Add Patient</h3>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Patient Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          type="number"
          name="phone"
          id="mobile"
          placeholder="Phone Number"
          onChange={(e) => {
            setNumber(e.target.value);
          }}
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Patient
        </Button>
      </div>
    </div>
  );
}
