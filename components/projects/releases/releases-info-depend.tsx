import { Dispatch, FC, Fragment, SetStateAction, useEffect, useState } from 'react';
import { BaseProjectDto, DetailedReleaseDto, ProjectDto, ReleaseDto, SetReleaseDto } from '@/api/src';
import { Autocomplete, Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { getReleases, searchProjects } from '@/apis/client-side/projects-actions.api';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import RemoveIcon from '@mui/icons-material/RemoveCircleOutline';


interface DependItemProps {
  edit?: boolean
  rel?: ReleaseDto;
  setRel: Dispatch<SetStateAction<SetReleaseDto>>;
  close?: () => void;
}
const DependItem: FC<DependItemProps> = ({ rel, setRel, close, edit }) => {
  const [editMode, setEditMode] = useState<boolean>(!!edit)
  const [inputProduct, setInputProduct] = useState<string | undefined | null>(rel?.projectName)
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(rel?.projectName)
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>(rel?.version)
  const [selectedVersionId, setSelectedVersionId] = useState<string | undefined>(rel?.id)
  const [suggestedProducts, setSuggestedProducts] = useState<BaseProjectDto[]>([]);
  const [suggestedReleases, setSuggestedReleases] = useState<ReleaseDto[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      handleSelectProduct(selectedProduct)
    }
  }, [editMode])

  const searchProducts = async (query: string) => {
    setLoading(true);
    try {
      const plats = await searchProjects(query)
      setLoading(false);
      return plats
    } catch (error) {
      console.error(`Err searching products: ${error}`);
      setLoading(false);
    }
  };

  const fetchVersions = async (value: string) => {
    try {
      const versions = await getReleases(value)
      return versions
    } catch (error) {
      console.error(`Err searching versions: ${error}`);
    }
  };

  const handleProductInputChange = async (value: string | null) => {
    setInputProduct(value)
    if (value && value.length >= 2) {
      const plats = await searchProducts(value);
      plats && setSuggestedProducts(plats)
    } else {
      setSuggestedProducts([]);
    }
  };

  const handleSelectProduct = async (value: string | null) => {
    if (value) {
      setSelectedProduct(value)
      const version = await fetchVersions(value)
      setSuggestedReleases(version ?? [])
    } else {
      setSelectedProduct(undefined)
      setSelectedVersionId(undefined)
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedVersionId(e.target.value)
  }

  const getDependenciesInSet = (setRel: SetReleaseDto, rm: boolean) => {
    const setDep = new Set(setRel.dependencies);
    if (selectedVersionId) {
      if (rel) {
        setDep.delete(rel.id);
      }
      !rm && setDep.add(selectedVersionId);
    } else if (rel) {
      setDep.delete(rel.id);
    }
    return Array.from(setDep);
  }

  const HandleOnCancel = () => {
    setSelectedProduct(rel?.projectName)
    setSelectedVersionId(rel?.id)
    setSelectedVersion(rel?.version)
    rel ? setEditMode(false) : close && close()
  }

  const handleRemove = () => {
    saveDepend(true)
  }

  const saveDepend = (rm = false) => {
    setRel(rel => {
      const copyRel = { ...rel }
      copyRel.dependencies = getDependenciesInSet(copyRel, rm)
      return copyRel
    })
    HandleOnCancel()
  }

  const editBody = () => (
    <Stack direction="row" alignItems={"center"} gap={1} my={2}>
      <Autocomplete
        sx={{ width: 200 }}
        options={suggestedProducts?.map(p => p.name)}
        loading={loading}
        value={inputProduct ?? ""}
        onInputChange={(event, value) => handleProductInputChange(value)}
        onChange={(event, value) => handleSelectProduct(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            size='small'
            label="Product"
            variant="outlined"
            required
          />
        )}
        renderOption={(props, option) => (
          <li {...props} style={{ width: "100%" }}>
            <Box >
              <Typography variant="body2">{`${option}`}</Typography>
            </Box>
          </li>
        )}
      />
      {!!selectedProduct &&
        <TextField
          select
          label="Version"
          value={selectedVersionId}
          onChange={handleVersionChange}
          required
          margin="normal"
          size="small"
          sx={{ width: 200, m: 0 }}
        // error={!!errors.type}
        // helperText={errors.type}
        >
          {!!suggestedReleases.length
            ? suggestedReleases?.map(r => <MenuItem sx={{ width: "100%" }} key={r.version} value={r.id}>{r.version}</MenuItem>)
            : <MenuItem sx={{ width: "100%" }}>{"No version found"}</MenuItem>
          }
        </TextField>}
      <Stack direction="row" height={24} >
        <IconButton sx={{ p: .25 }} onClick={HandleOnCancel}>
          <CancelIcon fontSize="small" color="error" />
        </IconButton>
        {selectedProduct && selectedVersionId &&
          <IconButton sx={{ p: .25 }} onClick={() => saveDepend()}>
            <SaveIcon fontSize="small" color='success' />
          </IconButton>}
      </Stack>
    </Stack>
  )

  const body = () => (
    <ListItem sx={{ p: 0, gap: 1 }} >
      <ListItemText primary={selectedProduct} secondary={`Version: ${selectedVersion}`} />
      <ListItemIcon sx={{ minWidth: 24 }} onClick={() => setEditMode(true)}><EditIcon /></ListItemIcon>
      <ListItemIcon sx={{ minWidth: 24 }} onClick={handleRemove}><RemoveIcon color={"warning"} /></ListItemIcon>
    </ListItem>
  )

  return (
    <Fragment>
      {editMode ? editBody() : body()}
    </Fragment>
  )
}


interface RelInfoDependProps {
  project: ProjectDto
  rel: DetailedReleaseDto;
  setRel: Dispatch<SetStateAction<SetReleaseDto>>
}

const RelInfoDepend: FC<RelInfoDependProps> = ({ project, rel, setRel }) => {
  const [addDepend, setAddDepend] = useState<boolean>(false)

  return (
    <Fragment>
      <Box mb={2}>
        <List sx={{ p: 0 }}>
          {rel.dependencies?.map((dep) => <DependItem edit={false} rel={dep} setRel={setRel} />)}
        </List>
      </Box>
      {addDepend && <DependItem edit={true} setRel={setRel} close={() => setAddDepend(false)}></DependItem>}
      <Box marginTop={2}>
        <Button
          variant="text"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddDepend(true)}
          sx={{ textTransform: "none", gap: 1 }}
        >
          Add Dependence
        </Button>
      </Box>

    </Fragment>
  );
};

export default RelInfoDepend;
