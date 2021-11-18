## Elastic instabilities
Introduction
============

Elastic materials are characterised by their ability to undergo local
dilation, shear and twist under externally applied load and relax to a
neutral configuration when the load is removed. More often when the
applied load exceeds a critical value these materials undergo
instabilities characterized by a smooth or dramatic change in their
morphology. These instabilities are captured by identifying the forces
at play and deriving governing equations for the deformation of the
material. The deformation is then related to the internal stress through
a constituent relation. In this set of 5 tutorials we will see how to
solve for the deformation field of the material and capture the various
instabilities using [`auto-07p` ](https://github.com/auto-07p/auto-07p),
a numerical continuation package. These elastic instability problems, as
we shall see, are boundary value problems which are many a times hard to
solve even numerically (analytical solutions are very scarce). The
purpose of this tutorial really is to highlight the power of `auto-07p`
in solving these systems. Though the documentation if a a very good
place to start, I realized during the learning process that there are a
few important technical gaps that are often not discussed if one were to
go from the documentation to implementing it in your research problem.

In this series we will be discussing 5 example problems, each with
certain unique aspect in terms of implementing it in `auto-07p`
associated with the type of problem. It will become clear what I mean by
this as we go over the examples. The problems we will be looking at are

-   Bending of an *elastica*

-   Buckling of a sheet

-   Beam with oscillating forcing

-   Growth of a sheet

-   Periodic solutions to sheet deformation

`auto-07p` framework
--------------------

The framework that we use to solve elastic instability problems has 3
major steps. $(i)$ To identify the model equations that describe the
deformation field in elastic structure, derived either
phenomenologically or from first principles. This is the part that
captures the physics of the problem. $(ii)$ Using `auto-07p` to solve
the system with the appropriate boundary conditions and continue the
solution along a physical parameter in the system to see if the
morphology changes with this parameter. `auto-07p` accepts first-order
differential equations of the form
$$u'(t) = f(u(t), p), \quad f(.,.) \in \text{R}^n,$$ where $p$ are the
parameters in the problem.If we have a higher order system, we need to
convert and represent it in this form. `auto-07p` finds solution to this
equations i.e. $f(u(t),p)=0$ and will continue it along the different
parameters $p$ in the model. $(iii)$ The process of segregating the
solution from the files that `auto-07p` spits out and then to understand
the results.

The steps I will be focusing in this tutorial is the second and third
one where we will assume that the equations required to describe the
elastic structure are already available. We will extract the bifurcation
diagram as well as plot the solution files.

Bending of an *elastica*
========================

The first problem we will solve in this tutorial is the deformation of
an inextensible slender filament known as the *elastica*. We solve this
in 2-dimensions where the structure can be represented only using
curvature information along the filament (captured up to global
translations and rotations). The concept of an elastica is very old and
dates back to the times of Bernoulli and Euler (read more about it
[here](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-103.pdf)).
We consider an elastica hinged at one end while the other end
experiences a point force $\vec{p}= (p_x, p_y)$. This problem is
described in detail in Prof. Audoly's [lecture
notes](https://catalogue.polytechnique.fr/cours.php?id=2792). The
elastic energy of an elastica under an externally applied point force is
$$\begin{aligned}
    \mathcal{E}=& \ \underbrace{\frac{1}{2} \int_0^L B \kappa^2(s) \ \text{d}s}_{\text{Bending energy}} - \underbrace{\int_0^L (p_x \cos \psi + p_y \sin \psi) \ \text{d}s}_{\text{Potential energy}}.\end{aligned}$$
Here $s$ is the arc-length and the first term in the above equation is
the bending energy term while the next is the work done/potential energy
due to the applied force. The work done is nothing but
$-\vec{p}.\vec{r}(L)$ where $\vec{r}(L)$ is the coordinate of the end.
The equilibrium equation by extremising this energy or equivalently the
Euler-Lagrange equation is $$\begin{aligned}
    B \psi''(s) - p_x \sin \psi + p_y \cos \psi =& \ 0.\end{aligned}$$
Since we have fixed end one side, this translates to $\psi(0) = 0$ and a
torque free boundary at the other side implies
$\kappa(L) = \psi'(L) = 0$. This equation can be non-dimensionalized
using $L$ as the length-scale and $B$ as the stress scale. After
non-dimensionalization we get
$\psi''(s) - p_x \sin \psi + p_y \cos \psi = 0$. The rescaled forces are
$\tilde{p}_i = p_i/(BL^2),\ i=x, y$ (we have dropped the tildes for
simplicity).

In order to implement this equation in `auto-07p` we need to first
convert it into a set of first order differential equations. We define
$u_1 = \psi(s), u_2 = \psi'(s)$ and this results in: $$\begin{aligned}
    u_1' =& \ u_2,\\
    u_2' =& \ p_x \sin u_1 + p_y \cos u_1.\end{aligned}$$ We know from
geometry that $x'(s) = \cos \psi(s), y'(s) = \sin \psi(s)$, which can
also be combined with the above equations to obtain a set of 4
equations. We supplement it with boundary conditions:
$u_1(0) = u_2(1) = x(0) = y(0) = 0$.

Constants, `*.f90/*.c`, scripts
-------------------------------

For each problem we are interested in solving in `auto-07p` , there are
at least 3 files required. These are the constant files (which has a
filename as c.\*) that inform `auto-07p` of the details of the problem
and the numerical details required for the package to prepare the
solver. The second file is a `Fortran90/C` file with the governing
equations, boundary conditions, integral constraints and the variables
that need to be probed from the solution in order to plot later to
understand the results. The last is the most important `python` script
that will run auto with the specified constants. The script will help us
span the phase space and continue along different solution branches in
case of bifurcations.

In Table. [1](#tab:const){reference-type="ref" reference="tab:const"} we
note some of the most important constants that we will use in this
tutorial set. A very useful cheat-sheet is in the manual under the title
"Quick reference" of chapter 10.

::: {#tab:const}
  **Constants**   **Description**                     **Values for elastica**
  --------------- ----------------------------------- ---------------------------------------------
  `ICP`           Continuation parameters             $p_x/p_y$
  `NPAR`          Number of parameters                4
  `IPS`           Type of problem                     4 for boundary value problems
  `ISP`           Switch for bifurcation detection    2 will identify all kinds
  `NBC`           Number of boundary conditions       4
  `ISW`           Mode for branch switching           1 for normal, -1 for switching to different
  `UZR`           User defined points for output      $p_x/p_y$
  `UZSTOP`        User defined range for parameters   $(-80, 20)$
  `NPR`           Print & save every NPR steps        20

  : List of constants in the `auto-07p` with their description and
  values based on problem of interest.
:::

``` {.python language="Python" caption="Python example"}
import numpy as np
    
def incmatrix(genl1,genl2):
    m = len(genl1)
    n = len(genl2)
    M = None #to become the incidence matrix
    VT = np.zeros((n*m,1), int)  #dummy variable
    
    #compute the bitwise xor matrix
    M1 = bitxormatrix(genl1)
    M2 = np.triu(bitxormatrix(genl2),1) 

    for i in range(m-1):
        for j in range(i+1, m):
            [r,c] = np.where(M2 == M1[i,j])
            for k in range(len(r)):
                VT[(i)*n + r[k]] = 1;
                VT[(i)*n + c[k]] = 1;
                VT[(j)*n + r[k]] = 1;
                VT[(j)*n + c[k]] = 1;
                
                if M is None:
                    M = np.copy(VT)
                else:
                    M = np.concatenate((M, VT), 1)
                
                VT = np.zeros((n*m,1), int)
    
    return M
```


[back](./research)
