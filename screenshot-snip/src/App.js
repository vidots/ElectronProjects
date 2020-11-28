import './App.css';
import { Navbar, Button, Alignment, Icon } from "@blueprintjs/core";

function App() {
  const onSnipClick = async () => {
    const { desktopCapturer, remote, shell } = window.require('electron')
    const win = remote.getCurrentWindow()
    const windowRect = win.getBounds()
    const path = window.require('path')
    const os = window.require('os')
    const fs = window.require('fs')
    const screen = remote.screen;
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const maxDimension = Math.max(screenSize.width, screenSize.height);
    win.hide()
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: maxDimension * window.devicePixelRatio,
          height: maxDimension * window.devicePixelRatio
        }
      })
      const entireScreenSource = sources.find(
        source => source.name === 'Entire Screen'
      )
      if (entireScreenSource) {
        const outputPath = path.join(os.tmpdir(), 'screenshot.png')
        const image = entireScreenSource.thumbnail.resize({
          width: screenSize.width,
          height: screenSize.height
        })
          .crop(windowRect).toPNG();
        fs.writeFile(outputPath, image, err => {
          // win.show()
          if (err) return console.error(err);
          shell.openExternal(`file://${outputPath}`);
        });
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div className="App">
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Electron Snip</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="settings" text="Settings" />
          <Button className="bp3-minimal" icon="help" text="About" />
          <Button className="bp3-minimal" icon="camera" text="Snip" onClick={onSnipClick} />
        </Navbar.Group>
      </Navbar>
      <main className="App-main">
        <Icon icon="camera" iconSize={100} />
        <p>Electron Snip</p>
      </main>
    </div>
  );
}

export default App;