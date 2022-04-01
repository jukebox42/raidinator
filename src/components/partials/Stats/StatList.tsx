import { Stack } from "@mui/material";

// Components
import Stat from "./Stat";

// Interfaces
import * as BI from "../../../bungie/interfaces";
import { LIGHT_STAT_HASH } from "../../../utils/constants";

type Props = {
  stats: {
    [key: number]: number;
  };
  statTypes: BI.Destiny.Definitions.DestinyStatDefinition[];
}

const StatList = ( { stats, statTypes }: Props ) => {
  // sort the stats so they match the game. Thankfully they have an index
  statTypes.sort((a, b) => a.index - b.index);

  return (
    <Stack direction="row">
      {statTypes.map(statType => {
        // Skip the light stat. We don't want/need it in the list.
        if (statType.hash.toString() === LIGHT_STAT_HASH) {
          return;
        }

        // Find the stat that matches
        const statKey = Object.keys(stats).find(statHash => statType.hash.toString() === statHash);
        if (!statKey) {
          return;
        }

        return (
          <Stat key={statKey} value={stats[statKey]} iconUrl={statType.displayProperties.icon} />
        )
      })}
    </Stack>
  );
}

export default StatList;
