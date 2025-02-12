import { Dispatch, FC, Fragment, SetStateAction, useState } from 'react';
import { BaseProjectDto, DetailedReleaseDto, ProjectDto, ReleaseDto, SetReleaseDto } from '@/api/src';
import { Autocomplete, Box, Button, CircularProgress, IconButton, List, ListItem, ListItemText, MenuItem, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { getReleases, searchProjects } from '@/apis/client-side/projects-actions.api';
import O_IconButton from '@/ui/o-icon-button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/CancelOutlined';


interface DependItemProps {
  rel?: ReleaseDto;
  setRel: Dispatch<SetStateAction<SetReleaseDto>>;
  close: () => void;
}
const DependItem: FC<DependItemProps> = ({ rel, setRel, close }) => {
  const [inputProduct, setInputProduct] = useState<string | undefined | null>(rel?.projectName)
  const [selectedProduct, setSelectedProduct] = useState<string>()
  const [selectedVersion, setSelectedVersion] = useState<string | undefined>(rel?.id)
  const [suggestedProducts, setSuggestedProducts] = useState<BaseProjectDto[]>([]);
  const [shoeVersion, setShoeVersion] = useState<boolean>(false);
  const [suggestedReleases, setSuggestedReleases] = useState<ReleaseDto[]>([]);

  const [loading, setLoading] = useState(false);

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
    selectedProduct && setSelectedProduct(undefined)
    selectedVersion && setSelectedVersion(undefined)
    if (value && value.length >= 2) {
      const plats = await searchProducts(value);
      plats && setSuggestedProducts(plats)
    } else {
      setSuggestedProducts([]);
    }
  };

  const handleSelectProduct = async (value: string | null) => {
    if (value) {
      setShoeVersion(true)
      setSelectedProduct(value)
      const version = await fetchVersions(value)
      console.log(version);

      setSuggestedReleases(version ?? [])
    } else {
      setShoeVersion(false)
      setSelectedProduct(undefined)
      setSelectedVersion(undefined)
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedVersion(e.target.value)
  }

  const HandleOnCancel = () => {
    setSelectedProduct(undefined)
    setSelectedVersion(undefined)
    close()
  }

  const saveDepend = () => {
    setRel(rel => {
      const copyRel = { ...rel }
      copyRel.dependencies = selectedVersion ? copyRel.dependencies ? [...copyRel.dependencies, selectedVersion] : [selectedVersion] : []
      return copyRel
    })
    close()
  }

  return (
    <Fragment>
      <Stack direction="row" alignItems={"center"} gap={1}>
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
            value={selectedVersion}
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
          {selectedProduct && selectedVersion &&
            <IconButton sx={{ p: .25 }} onClick={saveDepend}>
              <SaveIcon fontSize="small" color='success' />
            </IconButton>}
        </Stack>
      </Stack>
    </Fragment>
  )
}


interface RelInfoDependProps {
  project: ProjectDto
  rel: DetailedReleaseDto;
  setRel: Dispatch<SetStateAction<SetReleaseDto>>
}

const RelInfoDepend: FC<RelInfoDependProps> = ({ project, rel, setRel }) => {
  const [dependencies, setDependencies] = useState<ReleaseDto[] | undefined>(rel.dependencies)
  const [addDepend, setAddDepend] = useState<boolean>(false)

  return (
    <Fragment>
      <Box mb={2}>
        {dependencies && dependencies.length > 0 ? (
          <List sx={{ p: 0 }}>
            {dependencies.map((dep) => {
              return <ListItem key={dep.projectName} sx={{ p: 0 }} >
                <ListItemText primary={dep.projectName} secondary={`Version: ${dep.version}`} />
              </ListItem>
            })}
          </List>
        ) : (
          <Typography>No dependencies defined</Typography>
        )}
      </Box>
      {addDepend && <DependItem setRel={setRel} close={() => setAddDepend(false)}></DependItem>}
      {/* Add Member Button */}
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
