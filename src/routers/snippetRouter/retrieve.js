import { Router } from 'express'
import GistSnippet from '../../models/GistSnippet';

const router = Router();

router.get('/s/:id', (req, res) => {
    const id = req.params.id;
    if(!id) res.status(422).send('No ID parameter is specified');
    const isDown = (Object.keys(req.query).length !== 0);

    GistSnippet.findById(id, (err, snippet) => {
        if(err) return res.status(500).send('Internal server error');
        if(!snippet) return res.status(404).send('Cannot find your snippet!');
        if(isDown) {
            res.set({'Content-Disposition': `attachment; filename=${snippet.name}`});
            res.type('text/plain');
            return res.send(snippet.content);
        } else {
            return res.type('text/plain').send(snippet.content);
        }
    });
});

export default router;