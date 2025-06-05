import React, { FC, Fragment, useState } from 'react';
import { Typography, Card, CardContent, Stack, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import Article from '../../../assets/projects/article.svg';
import ArticleOff from '../../../assets/projects/article-off.svg';
import MdDocsEditor from './md-editor';
import { DetailedProjectDto, DocDto } from '@/api/src';
import O_IconButton from '@/ui/o-icon-button';
import { useGetApp } from '@/providers/getapp.provider';
import { Delete } from "@mui/icons-material";
import { useDeleteDoc } from '@/hooks/docs.query.hook';
import ConfirmDialog from '@/components/utils/dialog/confirm';

interface DocsItemProps {
	project: DetailedProjectDto;
	doc: DocDto
}

const DocsItem: FC<DocsItemProps> = ({ project, doc }) => {
	const { router } = useGetApp()
	const [displayDoc, setDisplayDoc] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [content, setContent] = useState(doc.readme ?? "");
	const delDoc = useDeleteDoc()

	const onDelete = () => {
		delDoc.mutate({ projectName: project.name, docId: doc.id })
	}

	const handleDelete = () => {
		setOpenDialog(true)
	}

	return (
		<Fragment>
			<Card sx={{
				boxShadow: "0px -1px 4px rgba(0, 0, 0, 0.2)", // Shadow only on top
				mb: 2,
				borderBottom: "solid 1px rgba(0, 0, 0, 0.2)"
			}}>
				<CardContent>
					<Stack direction={"row"} justifyContent={"space-between"}>
						<Typography variant="h6">{doc.name}</Typography>
						<Stack direction={"row"} alignItems={"center"} gap={1}>
							{!doc.isUrl && <Fragment>
								<O_IconButton onClick={() => setDisplayDoc(!displayDoc)} >
									{displayDoc ? <ArticleOff /> : <Article />}
								</O_IconButton>
							</Fragment>
							}
							{doc.isUrl
								? <a href={doc.docUrl} target="_blank" rel="noopener noreferrer">
									<O_IconButton>
										<LinkIcon />
									</O_IconButton>
								</a>
								: <O_IconButton onClick={() => { router.push(router.asPath + "/" + doc.id.toString()) }}>
									<LinkIcon />
								</O_IconButton>}
							<IconButton size="small" onClick={handleDelete} color="error" aria-label="delete">
								<Delete fontSize='small' />
							</IconButton>
						</Stack>
					</Stack>
					<Typography variant="body2" color="text.secondary"><b>Updated on:</b> {doc.updatedAt}</Typography>
					{!doc.isUrl &&
						<MdDocsEditor content={content} setContent={setContent} isEditing={false} show={displayDoc} />
					}
				</CardContent>
			</Card>
			{openDialog && <ConfirmDialog
				open={openDialog}
				setOpen={setOpenDialog}
				mes={`Are you shure te delete '${doc.name}' documentation`}
				onConfirm={onDelete}
			/>}
		</Fragment>
	);
};

export default DocsItem;
