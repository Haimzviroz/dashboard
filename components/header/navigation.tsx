

import { NavBarOption } from "@/types/enum";

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
import { Tab, Tabs } from "@mui/material";
import { useGetApp } from "@/providers/getapp.provider";
import { R_PROJECTS } from "@/apis/routes";

interface NavBarItem {
  key: NavBarOption,
  name: string,
  icon: any,
  activeIcon: any,
  isActive?: boolean,
  disabled?: boolean,
  route: string
}

const items: NavBarItem[] = [
  {
    key: NavBarOption.OVERVIEW,
    name: "Overview",
    icon: <Overview />,
    activeIcon: <OverviewAct />,
    route: NavBarOption.OVERVIEW
  },
  {
    key: NavBarOption.RELEASES,
    name: "Versions",
    icon: <Version />,
    activeIcon: <VersionAct />,
    route: NavBarOption.RELEASES,
  },
  {
    key: NavBarOption.REGULATION,
    name: "Regulations",
    icon: <Regulations />,
    activeIcon: <RegulationsAct />,
    isActive: true,
    disabled: true,
    route: NavBarOption.REGULATION,
  },
  {
    key: NavBarOption.POLICY,
    name: "Policy",
    icon: <Policy />,
    activeIcon: <PolicyAct />,
    isActive: true,
    disabled: true,
    route: NavBarOption.POLICY,
  },
  {
    key: NavBarOption.DOCS,
    name: "Docs",
    icon: <Docs />,
    activeIcon: <DocsAct />,
    disabled: true,
    route: NavBarOption.DOCS
  },
  {
    key: NavBarOption.SETTINGS,
    name: "Settings",
    icon: <Set />,
    activeIcon: <SetAct />,
    route: NavBarOption.SETTINGS
  }
]


const NavBar = () => {
  const { navBarActive, router } = useGetApp()

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
    <Tabs value={navBarActive} onChange={() => { }} role="navigation" variant="scrollable" >
      {getNavItems()}
    </Tabs>
  )
}

export default NavBar