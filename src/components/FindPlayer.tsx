import React, { useState, useEffect, useMemo, useContext } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Box,
  CardContent,
  Autocomplete,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import throttle from "lodash/throttle";

import db from "../store/db";
import { getAssetUrl } from "../utils/functions";

// Components
import { TouchCard } from "./generics";

// Interfaces
import { findPlayers } from "../bungie/api";
import * as BI from "../bungie/interfaces";
import { PlayerData } from "../utils/interfaces";
import { AppContext } from "../store/AppContext";

interface FindPlayerProps {
  cardKey: string;
  onDelete: (key: string) => void;
  onFoundPlayer: (player: PlayerData, cardKey: string) => void;
}

const FindPlayer = ({ onFoundPlayer, cardKey, onDelete }: FindPlayerProps) => {
  const context = useContext(AppContext);
  const [value, setValue] = useState<PlayerData | null>(null); //todo: do i need this?
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PlayerData[]>([]);
  const [dbOptions, setdbOptions] = useState<PlayerData[]>([]);

  useLiveQuery(async () => {
    const ids = context.map(c => c.id);
    const previousSearches = (await db.AppSearches.toArray())
      .filter(item => !ids.includes(item.membershipId.toString()));
    setOptions([...options, ...previousSearches]);
    setdbOptions([...previousSearches]);
  });

  const search = useMemo(() =>
    throttle(
      (
        text: string,
        callback: (response: BI.User.UserSearchResponse) => void,
      ) => findPlayers(text, 0).then(callback),
      1000
    ), []);

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : [...dbOptions]);
      return;
    }

    search(inputValue, (response: BI.User.UserSearchResponse) => {
      if (active) {
        const ids = context.map(c => c.id);
        // if no results (or error)
        if (!response.searchResults) {
          setOptions([...dbOptions.filter(item => !ids.includes(item.membershipId.toString()))]);
          return;
        }

        let newOptions: PlayerData[] = [];

        if (value) {
          newOptions = [value];
        }

        // filter out the players without memberships then map them to player objects
        const searchOptions = response.searchResults
          .filter(item => item.destinyMemberships.length > 0)
          .filter(item => !ids.includes(item.destinyMemberships[0].membershipId.toString()))
          .map(item => {
            return {
              bungieGlobalDisplayName: item.bungieGlobalDisplayName,
              bungieGlobalDisplayNameCode: item.bungieGlobalDisplayNameCode,
              membershipId: item.destinyMemberships[0].membershipId,
              iconPath: item.destinyMemberships[0].iconPath,
              membershipType: item.destinyMemberships[0].membershipType,
            }
          });

        // map results
        newOptions = [...newOptions, ...searchOptions];
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    }
  }, [value, inputValue, search, context]);

  const renderOption = (props: any, option: PlayerData) => {
    return (
      <li {...props}>
        <img src={getAssetUrl(option.iconPath)} className="icon-platform" />
        <Typography variant="h6">
          {option.bungieGlobalDisplayName}#{option.bungieGlobalDisplayNameCode}
        </Typography>
      </li>
    )
  };

  const renderInput = (params: any) => {
    return (
      <TextField
        {...params}
        label="Search"
        InputProps={{
          ...params.InputProps,
          startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
        }}
        variant="standard"
        autoComplete="new-password"
        autoFocus
      />
    );
  };

  return (
    <TouchCard
      className="guardianCard"
      sx={{m: 1, mb: 0, p: 0, background: "rgb(16 19 28 / 0.65)" }}
      onDelete={() => onDelete(cardKey)}
    >
      <CardContent sx={{ p: 0, pb: "0px !important" }}>
        <Box sx={{m: 2, mt: "53px"}}>
          <Autocomplete
            id="findGuardian"
            filterOptions={x => x}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            options={options}
            onInputChange={(event: any, newValue: string) => setInputValue(newValue)}
            onChange={async (event: any, newValue: PlayerData | null) => {
              if (newValue) {
                await db.putSearchResult(newValue); // store player in search table.
                onFoundPlayer(newValue, cardKey); // pass the found player back to the app
              }
            }}
            getOptionLabel={(option) => option.membershipId.toString()}
            renderOption={renderOption}
            renderInput={renderInput}
          />
        </Box>
      </CardContent>
    </TouchCard>
  );
};

export default FindPlayer;