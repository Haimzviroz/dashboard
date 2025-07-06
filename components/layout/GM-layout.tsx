import { FC, Fragment, ReactElement, useState } from "react"
import GetAppLogo from "../header/logo"
import SideBar from "../side-bar/side-bar"
import { Box } from "@mui/material"
import ErrorPage from '../../pages/error';
import LoginPage from "../main/page";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TLS_MuiProvider from "@/providers/rtl-mui.provider";
import TeamMuiProvider from "@/providers/team-mui.provider";
import GetAppProvider from "@/providers/getapp.provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppScopeEnum } from "@/types/enum";
import { R_GET_MAP } from "@/apis/routes";

interface GM_layoutProps {
	page: ReactElement
	withGroups?: boolean;
}

const GM_layout: FC<GM_layoutProps> = ({ page, withGroups }) => {

	if (page.props.error) return <ErrorPage {...page.props.error}></ErrorPage>
	if (page.props.tokenError) return <LoginPage routePath={R_GET_MAP} {...page.props} />

	return (
		<Fragment>
			<TLS_MuiProvider>
				<TeamMuiProvider>
					<GetAppProvider>
						<GetAppLogo scope={AppScopeEnum.getmap} />
						<Box sx={{ display: "flex" }}>
							<SideBar
								groupList={page.props.groupList}
								withGroups={withGroups}
								scope={AppScopeEnum.getmap} />
							{page}
						</Box>
					</GetAppProvider>
				</TeamMuiProvider>
			</TLS_MuiProvider>
		</Fragment>
	)
}

export default GM_layout