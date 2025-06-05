

import { ProNavBarOption } from "@/types/enum";

import Overview from '../../assets/nav-bar/overview.svg'
import OverviewAct from '../../assets/nav-bar/overview-active.svg'
import Version from '../../assets/nav-bar/version.svg'
import VersionAct from '../../assets/nav-bar/version-active.svg'
import Regulations from '../../assets/nav-bar/regulation.svg'
import RegulationsAct from '../../assets/nav-bar/regulation-active.svg'
import Policy from '../../assets/nav-bar/policy.svg'
import PolicyAct from '../../assets/nav-bar/policy-active.svg'
import Docs from '../../assets/nav-bar/docs.svg'
import DocsAct from '../../assets/nav-bar/docs-active.svg'
import Set from '../../assets/nav-bar/settings.svg'
import SetAct from '../../assets/nav-bar/settings-active.svg'
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useGetApp } from "@/providers/getapp.provider";
import { R_PROJECTS } from "@/apis/routes";
import { FC } from "react";

interface NavBarItem {
  key: ProNavBarOption,
  name: string,
  icon: any,
  activeIcon: any,
  isActive?: boolean,
  disabled?: boolean,
  route: string
}

const items: NavBarItem[] = [
  {
    key: ProNavBarOption.OVERVIEW,
    name: "Overview",
    icon: <Overview />,
    activeIcon: <OverviewAct />,
    route: ProNavBarOption.OVERVIEW
  },
  {
    key: ProNavBarOption.RELEASES,
    name: "Versions",
    icon: <Version />,
    activeIcon: <VersionAct />,
    route: ProNavBarOption.RELEASES,
  },
  {
    key: ProNavBarOption.REGULATION,
    name: "Regulations",
    icon: <Regulations />,
    activeIcon: <RegulationsAct />,
    isActive: true,
    route: ProNavBarOption.REGULATION,
  },
  {
    key: ProNavBarOption.POLICY,
    name: "Policy",
    icon: <Policy />,
    activeIcon: <PolicyAct />,
    isActive: true,
    disabled: true,
    route: ProNavBarOption.POLICY,
  },
  {
    key: ProNavBarOption.DOCS,
    name: "Docs",
    icon: <Docs />,
    activeIcon: <DocsAct />,
    route: ProNavBarOption.DOCS
  },
  {
    key: ProNavBarOption.SETTINGS,
    name: "Settings",
    icon: <Set />,
    activeIcon: <SetAct />,
    route: ProNavBarOption.SETTINGS
  }
]

interface ProNavBarProps {
  projectName: string
}

const ProNavBar: FC<ProNavBarProps> = ({ projectName }) => {
  const { proNavBarActive: navBarActive, router } = useGetApp()

  const getNavItems = () => {
    return items.map((item: NavBarItem) => {
      item.isActive = item.key === navBarActive
      return (
        <Tab
          key={item.key}
          value={item.key}
          label={item.name}
          icon={item.isActive ? item.activeIcon : item.icon}
          iconPosition="start"
          role="navigation"
          onClick={() => !item.disabled && router.push(`${R_PROJECTS}/${router.query.projectId}/${item.route}`)}
          sx={{ textTransform: 'none', minHeight: 48, fontWeight: "bold" }} />
      )
    })
  }
  return (
    <Box bgcolor={'#f1f0fb'} sx={{ px: 4, pt: 1, borderTopRightRadius: 24 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', px: 1 }}>
        {projectName}
      </Typography>
      <Tabs value={navBarActive} onChange={() => { }} role="navigation" variant="scrollable" >
        {getNavItems()}
      </Tabs>
    </Box>
  )
}

export default ProNavBar