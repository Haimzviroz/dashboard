import React, { FC, useState } from 'react';
import { Typography, Card, CardContent, IconButton, Stack } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Article from '../../../assets/projects/article.svg';
import ArticleOff from '../../../assets/projects/article-off.svg';
import ReactMarkdown from 'react-markdown';
import MdDocs from './md-editor';

interface DocsItemProps {
	doc: any
}

const DocsItem: FC<DocsItemProps> = ({ doc }) => {
	const [displayDoc, setDisplayDoc] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(doc.content);

	return (
		<Card key={doc.title} sx={{
			boxShadow: "0px -1px 4px rgba(0, 0, 0, 0.2)", // Shadow only on top
			mb: 2,
			borderBottom: "solid 1px rgba(0, 0, 0, 0.2)"
		}}>
			<CardContent>
				<Stack direction={"row"} justifyContent={"space-between"}>
					<Typography variant="h6">{doc.title}</Typography>
					<Stack direction={"row"} alignItems={"center"}>
						{displayDoc && <IconButton onClick={() => { setIsEditing(!isEditing) }}>
							{isEditing ? <SaveIcon /> : <EditIcon />}
						</IconButton>}
						{doc.type === 'url' ?
							<IconButton component="a" href={doc.url} target="_blank" rel="noopener noreferrer">
								<LinkIcon />
							</IconButton>
							: <IconButton onClick={() => {
								setDisplayDoc(!displayDoc);
								displayDoc && setIsEditing(false)
							}} >
								{displayDoc ? <ArticleOff /> : <Article />}
							</IconButton>
						}
					</Stack>
				</Stack>
				<Typography variant="body2" color="text.secondary">Last updated: {doc.lastUpdated}</Typography>
				{displayDoc && (
					!isEditing ? <ReactMarkdown>{content}</ReactMarkdown> : <MdDocs content={content} setContent={setContent} />
				)}
			</CardContent>
		</Card>
	);
};

export default DocsItem;
