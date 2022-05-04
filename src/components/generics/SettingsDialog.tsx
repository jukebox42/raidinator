import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  FormGroup,
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { AppContext } from "context/AppContext";
import { useContext, useEffect, useState } from "react";

type Field = {
  label: string,
  name: string;
  value: boolean;
}

type FieldGroup = {
  key: string;
  label: string;
  fields: Field[];
}

type Props = {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog = ({ onClose, open = false }: Props) => {
  const appContext = useContext(AppContext);
  const [form, setForm] = useState({ ...appContext.appSettings });

  const onSave = () => {
    appContext.setAppSettings({ ...form });
    onClose();
  }

  // handle resetting the form on open/close
  useEffect(() => {
    setForm({ ...appContext.appSettings });
  }, [open])

  const displayForm: FieldGroup[] = [
    {
      key: "displayMods",
      label: "Display Mods",
      fields: [
        {
          label: "Champion Mods",
          name: "championMods",
          value: form.championMods,
        },
        {
          label: "Ammo Mods",
          name: "ammoMods",
          value: form.ammoMods,
        },
        {
          label: "Charged With Light Mods",
          name: "lightMods",
          value: form.lightMods,
        },
        {
          label: "Well Mods",
          name: "wellMods",
          value: form.wellMods,
        },
        {
          label: "Raid Mods",
          name: "raidMods",
          value: form.raidMods,
        },
        {
          label: "Special Seasonal Mods",
          name: "specialMods",
          value: form.specialMods,
        },
      ]
    },
  ]

  const handleChange = (event: any) => {
    setForm({...form, [event.target.name]: event.target.checked});
  };

  const renderCheckbox = (field: Field) => {
    return (
      <FormControlLabel
        key={field.name}
        control={
          <Checkbox checked={field.value} onChange={handleChange} name={field.name} color="secondary" />
        }
        label={field.label}
      />
    )
  };

  const renderFieldset = (fieldGroup: FieldGroup) => {
    return (
      <FormControl component="fieldset" key={fieldGroup.key} variant="outlined">
        <FormLabel component="legend" color="secondary">{fieldGroup.label}</FormLabel>
        <FormGroup>
          {fieldGroup.fields.map(field => renderCheckbox(field))}
        </FormGroup>
      </FormControl>
    )
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Settings
      </DialogTitle>
      <DialogContent>
        {displayForm.map(group => renderFieldset(group))}
      </DialogContent>
      <DialogActions>
      <Button onClick={onSave} color="success" autoFocus>
          Save
        </Button>
        <Button onClick={onClose} color="secondary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
