import { FC, Fragment, ReactElement } from "react";
import GetAppLogo from "../header/logo";
import SideBar from "../side-bar/side-bar";
import { Box } from "@mui/material";
import ErrorPage from "../../pages/error";
import LoginPage from "../main/page";
import GetAppProvider from "@/providers/getapp.provider";
import TLS_MuiProvider from "@/providers/rtl-mui.provider";
import TeamMuiProvider from "@/providers/team-mui.provider";
import { AppScopeEnum } from "@/types/enum";
import BodyBox from "../body/body-box";
import { R_GET_APP } from "@/apis/routes";
import SideBarProvider from "@/providers/sidebar.provider";

interface GA_layoutProps {
	page: ReactElement;
	withGroups?: boolean;
	children?: ReactElement;
}

const GA_layout: FC<GA_layoutProps> = ({ page, children, withGroups }) => {

	if (page.props.error) return <ErrorPage {...page.props.error}></ErrorPage>;
	if (page.props.tokenError) return <LoginPage routePath={R_GET_APP} {...page.props} />;

	return (
		<Fragment>
			<TLS_MuiProvider>
				<TeamMuiProvider>
					<GetAppProvider>
						<GetAppLogo scope={AppScopeEnum.getapp} />
						<Box sx={{ display: "flex" }}>
							<SideBarProvider>
								<SideBar
									groupList={page.props.groupList}
									withGroups={withGroups}
									scope={AppScopeEnum.getapp}
								/>
								<BodyBox>{children ?? page}</BodyBox>
							</SideBarProvider>
						</Box>
					</GetAppProvider>
				</TeamMuiProvider>
			</TLS_MuiProvider>
		</Fragment>
	);
};

export default GA_layout;
	