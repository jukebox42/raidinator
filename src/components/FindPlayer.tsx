import { useState, useEffect, useMemo, useContext } from "react";
import uniqBy from "lodash/uniqBy";
import {
  Paper,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
  AutocompleteRenderInputParams,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import throttle from "lodash/throttle";

import db from "../store/db";
import { getAssetUrl } from "../utils/functions";
import { findPlayers } from "../store/api";
import { AppContext } from "../context/AppContext";

// Interfaces

import * as BI from "../bungie/interfaces";
import { PlayerData } from "../utils/interfaces";


type FindPlayerProps = {
  memberIds: string[];
  onFoundPlayer: (player: PlayerData) => void;
}

const FindPlayer = ({ onFoundPlayer, memberIds }: FindPlayerProps) => {
  const appContext = useContext(AppContext);
  const [value, setValue] = useState<PlayerData | null>(null); //todo: do i need this?
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<PlayerData[]>([]);

  type SearchType = { data: BI.User.UserSearchResponse, error: any };

  const search = useMemo(() =>
    throttle(
      (
        text: string,
        callback: ({ data, error }: SearchType) => Promise<void>,
      ) => findPlayers(text, 0).then(callback),
      1000
    ), []);

  useEffect(() => {
    let active = true;

    if (inputValue === "") {
      db.AppSearches.toArray().then(previousSearch => {
        const newOptions = [
          ...previousSearch
        ].filter(item => !memberIds.includes(item.membershipId.toString()));

        setOptions(value ? [value] : newOptions);
      });
      return;
    }

    search(inputValue, async ({data, error }) => {
      if (!active) {
        return
      }

      const previousSearches = await db.AppSearches.toArray();

      if (error.errorCode !== 1) {
        appContext.addToast(`Search failed: ${error.errorStatus}`, "error");
        return;
      }

      // if no results (or error)
      if (!data.searchResults) {
        const opts = [
          ...previousSearches
        ].filter(item => !memberIds.includes(item.membershipId.toString()));
        setOptions(uniqBy(opts, "memberId"));
        return;
      }

      let newOptions: PlayerData[] = [];

      if (value) {
        newOptions = [value];
      }

      // filter out the players without memberships then map them to player objects
      const searchOptions = data.searchResults
        .filter(item => item.destinyMemberships.length > 0)
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
      newOptions = [
        ...newOptions,
        ...searchOptions,
        ...previousSearches
      ].filter(item => !memberIds.includes(item.membershipId.toString()));
      setOptions(uniqBy(newOptions, "memberId"));
    });

    return () => {
      active = false;
    }
  }, [value, inputValue, search, memberIds]);

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: PlayerData) => {
    return (
      <li {...props}>
        <img src={getAssetUrl(option.iconPath)} className="icon-platform" />
        <Typography variant="h6">
          {option.bungieGlobalDisplayName}#{option.bungieGlobalDisplayNameCode}
        </Typography>
      </li>
    )
  };

  const renderInput = (params: AutocompleteRenderInputParams) => {
    return (
      <TextField
        {...params}
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
    <Paper elevation={3} sx={{ m: 1, p: 1, borderRadius: 20, position: "fixed", bottom: 1, left: 1, right: 1, maxWidth: "430px" }}>
      <Autocomplete
        sx={{ p: 1, pr: 3, pl: 3 }}
        id="findGuardian"
        filterOptions={x => x}
        includeInputInList
        inputValue={inputValue}
        value={value}
        options={options}
        onInputChange={(_: React.SyntheticEvent<Element, Event>, newValue: string) => setInputValue(newValue)}
        onChange={async (_: React.SyntheticEvent<Element, Event>, newValue: PlayerData | null) => {
          if (newValue) {
            await db.putSearchResult(newValue); // store player in search table.
            onFoundPlayer(newValue); // pass the found player back to the app
            setValue(null);
            setInputValue("");
          }
        }}
        getOptionLabel={(option) => option.membershipId.toString()}
        renderOption={renderOption}
        renderInput={renderInput}
      />
    </Paper>
  );
};

export default FindPlayer;