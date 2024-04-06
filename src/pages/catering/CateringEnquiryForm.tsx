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
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as yup from "yup";
import { ICateringEnquiry } from "../../interface/types";
import { createCateringEnquiry } from "../../services/api";
import dayjs from "dayjs";
import { useStyles } from "../../styles/CateringFormStyle";

const EnquiryFormInitialValue: ICateringEnquiry = {
  fullName: "",
  email: "",
  typeOfEvent: "",
  guestCount: 0,
  mobileNumber: "",
  message: "",
  eventDate: "",
};

const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Name is required")
    .max(30, "Maximum 30 characters allowed"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  typeOfEvent: yup
    .string()
    .required("Type of Event is required")
    .max(30, "Maximum 30 characters allowed"),
  guestCount: yup
    .number()
    .required("Guest count is required")
    .positive("Guest count must be a positive number")
    .integer("Guest count must be an integer"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, {
      message: "Mobile number must be exactly 10 digits",
    }),
  message: yup.string().max(250, "Message must be at most 250 characters"),

  eventDate: yup.string().required("Event date is required"),
});

function CateringEnquiryForm() {
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ICateringEnquiry | null>(null);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const formRef = useRef<HTMLFormElement>(null);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
    control,
  } = useForm<ICateringEnquiry>({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: EnquiryFormInitialValue,
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

  const handleConfirmSubmit = async () => {
    try {
      if (formData) {
        await createCateringEnquiry(formData);
        reset();
        setFormData(null);
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

  const onSubmitCateringEnquiry = async (data: ICateringEnquiry) => {
    setFormData(data);
    handleOpenDialog();
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
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{
            textAlign: "center",
            fontFamily: " VanakkamPDX-Logo-Font",
            marginBottom: isSmallScreen ? 2 : 2,
          }}
        >
          Catering Enquiry Form
        </Typography>

        <form ref={formRef} onSubmit={handleSubmit(onSubmitCateringEnquiry)}>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <TextField
                label="Full Name *"
                fullWidth
                variant="outlined"
                {...register("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName ? errors.fullName.message : ""}
                className={classes.focused}
              />
            </Grid>
            <Grid item lg={6} xs={12}>
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
            <Grid item lg={6} xs={12}>
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
            <Grid item lg={6} xs={12}>
              <TextField
                label="Type Of Event*"
                fullWidth
                variant="outlined"
                {...register("typeOfEvent")}
                error={!!errors.typeOfEvent}
                helperText={
                  errors.typeOfEvent ? errors.typeOfEvent.message : ""
                }
                className={classes.focused}
              />
            </Grid>
            <Grid item lg={6} xs={12}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Controller
                    name="eventDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Event Date *"
                        slotProps={{
                          textField: {
                            error: !!errors.eventDate,
                          },
                        }}
                        disablePast
                        format="MM-DD-YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => field.onChange(date)}
                        className={classes.focused}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.eventDate && (
                  <FormHelperText error>
                    {errors.eventDate.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item lg={6} xs={12}>
              <TextField
                label="Guest Count"
                fullWidth
                variant="outlined"
                type="number"
                {...register("guestCount")}
                InputProps={{ inputProps: { min: 0 } }}
                className={classes.focused}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                {...register("message")}
                error={
                  !!errors.message ||
                  (formData?.message === "" &&
                    formRef.current?.reportValidity())
                }
                helperText={
                  errors.message
                    ? errors.message.message
                    : formData?.message === "" &&
                      formRef.current?.reportValidity()
                    ? "Message is required"
                    : ""
                }
                className={classes.focused}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                marginBottom: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  boxShadow: "none",
                  backgroundColor: "#6B0101",
                  "&:hover": {
                    backgroundColor: "#6B0101",
                    boxShadow: "none",
                  },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
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
              color: "#6B0101",
              borderColor: "#6B0101",
              "&:hover": {
                borderColor: "#6B0101",
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
              backgroundColor: "#6B0101",
              "&:hover": {
                backgroundColor: "#6B0101",
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

export default CateringEnquiryForm;
