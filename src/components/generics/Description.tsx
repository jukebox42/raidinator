import React from "react";
import { Typography } from "@mui/material";
import { blueGrey } from '@mui/material/colors';

import { getAssetUrl } from "utils/functions";

import Image from "./Image";

type Props = {
  children: string;
  fade?: boolean;
}

/**
 * Why did I hardcode these? Well I could load them but seems silly.
 * 
 * TODO: move this
 */
const imageMap = {
  "Void": "/common/destiny2_content/icons/DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png",
  "Solar": "/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png",
  "Arc": "/common/destiny2_content/icons/DestinyEnergyTypeDefinition_092d066688b879c807c3b460afdd61e6.png",
  "Stasis": "/common/destiny2_content/icons/DestinyDamageTypeDefinition_530c4c3e7981dc2aefd24fd3293482bf.png",
  "Disruption": "/common/destiny2_content/icons/DestinyBreakerTypeDefinition_da558352b624d799cf50de14d7cb9565.png",
  "Stagger": "/common/destiny2_content/icons/DestinyBreakerTypeDefinition_825a438c85404efd6472ff9e97fc7251.png",
  "Shield-Piercing": "/common/destiny2_content/icons/DestinyBreakerTypeDefinition_07b9ba0194e85e46b258b04783e93d5d.png",
};

const parseText = (text: string) => {
  if (text.indexOf("[") === -1) {
    return text;
  }
  const searches = Object.keys(imageMap);
  const words = text.split(" ");
  return words.map(word => {
    const found = searches.find(search => `[${search}]` === word);
    if (found) {
      return (<Image src={getAssetUrl(imageMap[found])} sx={{ width: 12, height: 12, mr: 1}} />);
    }
    return (<>{word} </>);
  });
};

const Description = ( { children, fade = false }: Props ) => {
  const sx = fade ? { color: blueGrey[300] } : {};
  const textArray = children.split("\n");

  return (
    <>
      {textArray.map((t, i) => (
        <Typography key={i} variant="body1" component="p" mt={1} sx={sx}>
          {React.Children.map(t, parseText)}
        </Typography>
      ))}
    </>
  )
};

export default Description;
