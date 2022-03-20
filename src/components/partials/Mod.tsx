import { useEffect, useState } from "react";
import {
  Alert,
  Typography,
} from "@mui/material";
import { v4 as uuid } from "uuid";
import uniq from "lodash/uniq";

import { DetailTooltip } from "../generics";
import { getAssetUrl } from "../../utils/functions";

// Components
import { Caption } from "../generics";

// Interfaces
import * as BI from "../../bungie/interfaces"
import db from "../../store/db";

type ModProps = {
  plug: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  showWarning?: boolean;
  showError?:boolean;
  reason?: string;
}

const Mod = ( {plug, showWarning, showError, reason}: ModProps ) => {
  // console.log(plug.displayProperties.name, plug);
  const [perks, setPerks] = useState<string[]>([]);

  useEffect(() => {
    if (perks.length > 0) {
      return () => {}
    }
    const perkHashes = plug.perks.map(p => p.perkHash.toString());
    db.DestinySandboxPerkDefinition.bulkGet(perkHashes).then(resp => {
      const perkDescriptions = resp
        .map(p => p.displayProperties?.description)
        .filter(p => p !== undefined);
      setPerks(uniq(perkDescriptions));
    });
  }, []);

  return (
    <DetailTooltip
      warning={showWarning}
      error={showError}
      title={
        <>
          {showWarning && reason && <Alert severity="warning">{reason}</Alert>}
          {showError && reason && <Alert severity="error">{reason}</Alert>}
          <Typography variant="body1"><strong>{plug.displayProperties.name}</strong></Typography>
          <Caption fade>{plug.itemTypeDisplayName}</Caption>
          {perks && perks.map(p => <Caption key={uuid()}>{p}</Caption>)}
          {plug.tooltipNotifications.map(t => <Caption key={uuid()}>{t.displayString}</Caption>)}
        </>
      }
    >
      <img src={getAssetUrl(plug.displayProperties.icon)} className="icon-mods" />
    </DetailTooltip>
  );
}

export default Mod;