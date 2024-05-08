import React from "react";
import { IDiscountPage } from "../../interface/types";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl,
  FormHelperText,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  Radio,
  InputAdornment,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import * as yup from "yup";
import { useStyles } from "../../styles/CateringFormStyle";
import Animate from "react-awesome-reveal";
import { keyframes } from "@emotion/react";
import { createDiscount } from "../../services/api";

const DiscountFormIniialValue: IDiscountPage = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
};
const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("Name is required")
    .max(30, "Maximum 30 characters allowed"),
  lastName: yup
    .string()
    .required("Name is required")
    .max(30, "Maximum 30 characters allowed"),

  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  mobileNumber: yup.string().required("Mobile number is required").max(10),
  // currency: yup
  //   .string()
  //   .required("Select currency")
  //   .oneOf(["percentage", "rupees"]),
});
const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

function DiscountPage() {
  const classes = useStyles();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IDiscountPage | null>(null);
  const [currency, setCurrency] = useState("percentage");
  const [percentageValue, setPercentageValue] = useState(""); // State to capture percentage value

  const formRef = useRef<HTMLFormElement>(null);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    control,
  } = useForm<IDiscountPage>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: DiscountFormIniialValue,
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = (data: boolean) => () => {
    setIsDialogOpen(false);
    if (data) {
      reset();
    }
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value); // Update selected currency state
  };

    const handlePercentageChange = (event) => {
      setPercentageValue(event.target.value);
    };

  const handleConfirmSubmit = async () => {
    try {
      if (formData) {
        // Include the currency value in the formData object
        let formDataWithCurrency = { ...formData, currency };

        if (currency === "percentage") {
          formDataWithCurrency = {
            ...formDataWithCurrency,
            percentage: percentageValue,
          };
        } else if (currency === "rupees") {
          formDataWithCurrency = { ...formDataWithCurrency, rupees: currency };
        }
        await createDiscount(formDataWithCurrency);
        reset();
        setFormData(null);
        setCurrency("percentage"); // Reset currency to default
        setPercentageValue(""); // Clear percentage value
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      handleCloseDialog(true)();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const newValue = value.replace(/\D/g, "");
    if (newValue.length <= 10) {
      e.target.value = newValue;
    }
  };

  const onSubmitDiscountForm = async (data: IDiscountPage) => {
    console.log("data", data);
    if (data) {
      setFormData(data);
      handleOpenDialog();
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 600,
          margin: "auto",
          padding: isSmallScreen ? 3 : 0,
        }}
      >
        <Animate keyframes={slideInLeft} duration={600} delay={100} triggerOnce>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{
              textAlign: "center",
              fontFamily: " VanakkamPDX-Logo-Font",
              // marginTop: 4,
              padding: 3,
            }}
          >
            Discount Form
          </Typography>

          <form ref={formRef} onSubmit={handleSubmit(onSubmitDiscountForm)}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <TextField
                  label="First Name *"
                  fullWidth
                  variant="outlined"
                  {...register("firstName")}
                  error={!!errors.firstName}
                  helperText={errors.firstName ? errors.firstName.message : ""}
                  className={classes.focused}
                  inputProps={{ maxLength: 31 }}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  label="Last Name *"
                  fullWidth
                  variant="outlined"
                  {...register("lastName")}
                  error={!!errors.lastName}
                  helperText={errors.lastName ? errors.lastName.message : ""}
                  className={classes.focused}
                  inputProps={{ maxLength: 31 }}
                />
              </Grid>

              <Grid item lg={12} xs={12}>
                <TextField
                  label="Email *"
                  fullWidth
                  variant="outlined"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  className={classes.focused}
                />
              </Grid>
              <Grid item lg={12} xs={12}>
                <TextField
                  label="Mobile Number *"
                  fullWidth
                  variant="outlined"
                  {...register("mobileNumber")}
                  error={!!errors.mobileNumber}
                  helperText={
                    errors.mobileNumber ? errors.mobileNumber.message : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <Typography variant="body1">+1&nbsp;</Typography>
                    ),
                  }}
                  inputProps={{
                    type: "tel",
                    maxLength: 10,
                    onChange: handleInputChange,
                  }}
                  className={classes.focused}
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <FormLabel>Select Units</FormLabel>
                <RadioGroup
                  aria-label="currency"
                  name="currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      value="percentage"
                      control={<Radio />}
                      label="Percentage"
                    />
                    <FormControlLabel
                      value="rupees"
                      control={<Radio />}
                      label="Rupees"
                    />
                    {currency === "percentage" && (
                      <TextField
                        type="number"
                        inputProps={{ maxLength: 3 }}
                        label="Percentage"
                        value={percentageValue}
                        onChange={handlePercentageChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        onInput={(e) => {
                          e.target.value = Math.max(0, parseInt(e.target.value))
                            .toString()
                            .slice(0, 3);
                        }}
                      />
                    )}

                    {currency === "rupees" && (
                      <TextField
                        type="number"
                        inputProps={{ maxLength: 8 }}
                        value={currency}
                        onChange={handleCurrencyChange}
                        label="Rupees"
                      />
                    )}
                  </Box>
                </RadioGroup>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  marginBottom: isSmallScreen ? 0 : 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    boxShadow: "none",
                    backgroundColor: "green",
                    borderRadius: "20px",
                    marginRight: 2,
                    "&:hover": {
                      backgroundColor: "green",
                      boxShadow: "none",
                      borderRadius: "20px",
                    },
                  }}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    boxShadow: "none",
                    borderRadius: "20px",
                    color: "green", // Set text color to green
                    borderColor: "green", // Set border color to green
                  }}
                  onClick={() => {
                    reset(); // Reset the form
                    setCurrency("percentage"); // Reset currency selection to default
                    setPercentageValue(""); // Clear percentage value
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </form>
        </Animate>
      </Box>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle>Confirm Submission</DialogTitle>
        </Box>
        <Divider />
        <DialogContent>Are you sure you want to submit the form?</DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog(false)}
            variant="outlined"
            sx={{
              color: "green",
              borderColor: "green",
              "&:hover": {
                borderColor: "green",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            autoFocus
            sx={{
              color: "white",
              backgroundColor: "green",
              "&:hover": {
                backgroundColor: "green",
              },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DiscountPage;