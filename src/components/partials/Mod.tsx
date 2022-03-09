import React, { useEffect } from "react";
import {
  Alert,
  Typography,
} from "@mui/material";
import { v4 as uuid } from "uuid";
import uniq from "lodash/uniq";

import { DetailTooltip } from "../generics";
import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces"
import db from "../../store/db";

type ModProps = {
  plug: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  showWarning?: boolean;
  warningReason?: string;
}

const Mod = ( {plug, showWarning, warningReason}: ModProps ) => {
  // console.log(plug.displayProperties.name, plug);
  const [perks, setPerks] = React.useState<string[]>([]);

  useEffect(() => {
    const perkHashes = plug.perks.map((p:any) => p.perkHash.toString());
    db.DestinySandboxPerkDefinition.bulkGet(perkHashes).then(resp => {
      const perkDescriptions = resp
        .map(p => p.displayProperties?.description)
        .filter(p => p !== undefined);
      setPerks(uniq(perkDescriptions));
    });
  }, []);

  return (
    <DetailTooltip
      title={
        <>
          {showWarning && warningReason && <Alert severity="warning">{warningReason}</Alert>}
          <Typography variant="body1">{plug.displayProperties.name}:</Typography>
          {perks && perks.map(p => <Typography key={uuid()} variant="caption" component="p" mt={1}>{p}</Typography>)}
          {plug.tooltipNotifications.map(t => <Typography key={uuid()} variant="caption" component="p" mt={1}>{t.displayString}</Typography>)}
        </>
      }
    >
      <img src={getAssetUrl(plug.displayProperties.icon)} className="icon-mods" />
    </DetailTooltip>
  );
}

export default Mod;