declare module "@mui/material/styles" {
    interface CardVariants {
        transparent: React.CSSProperties;
    }
  
    // allow configuration using `createTheme`
    interface CardVariantsOptions {
        transparent?: React.CSSProperties;
    }
}

declare module "@mui/material/Card" {
    interface CardPropsVariantOverrides {
        transparent: true;
    }
}