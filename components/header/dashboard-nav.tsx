import { DashNavBarOption, ProNavBarOption } from "@/types/enum";

import Product from '../../assets/nav-bar/product.svg'
import ProductAct from '../../assets/nav-bar/product-active.svg'
import Formation from '../../assets/nav-bar/formation.svg'
import FormationAct from '../../assets/nav-bar/formation-active.svg'
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useGetApp } from "@/providers/getapp.provider";
import { R_FORMATIONS, R_PROJECTS } from "@/apis/routes";
import { FC } from "react";

interface NavBarItem {
  key: DashNavBarOption,
  name: string,
  icon: any,
  activeIcon: any,
  isActive?: boolean,
  disabled?: boolean,
  route: string
}

const items: NavBarItem[] = [
  {
    key: DashNavBarOption.PRODUCTS,
    name: "Products",
    icon: <Product />,
    activeIcon: <ProductAct />,
    route: DashNavBarOption.PRODUCTS
  },
  {
    key: DashNavBarOption.FORMATIONS,
    name: "Formations",
    icon: <Formation />,
    activeIcon: <FormationAct />,
    route: DashNavBarOption.FORMATIONS,
  }
]

interface DashNavBarProps {
}

const DashNavBar: FC<DashNavBarProps> = () => {
  const { dashNavBarActive, router } = useGetApp()

  const getNavItems = () => {
    return items.map((item: NavBarItem) => {
      item.isActive = item.key === dashNavBarActive
      return (
        <Tab
          key={item.key}
          value={item.key}
          label={item.name}
          icon={item.isActive ? item.activeIcon : item.icon}
          iconPosition="start"
          role="navigation"
          onClick={() => !item.disabled && router.push(item.key === DashNavBarOption.PRODUCTS ? R_PROJECTS : R_FORMATIONS)}
          sx={{ textTransform: 'none', minHeight: 48, fontWeight: "bold" }} />
      )
    })
  }
  return (
    <Box bgcolor={'#f1f0fb'} sx={{ px: 4, pt: 1, borderTopRightRadius: 24 }}>
      <Tabs value={dashNavBarActive} onChange={() => { }} role="navigation" variant="scrollable" >
        {getNavItems()}
      </Tabs>
    </Box>
  )
}

export default DashNavBar